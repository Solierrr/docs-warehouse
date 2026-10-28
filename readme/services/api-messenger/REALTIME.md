<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/springboot.png" width="100" hspace="8" alt="Spring Boot" title="Spring Boot">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
</p>

# Tempo real

O cliente conecta por WebSocket e fala STOMP. Comandos vão para destinos `/app/*`. Eventos chegam por tópicos `/topic/*`, que o Spring repassa ao RabbitMQ por um relay STOMP. O RabbitMQ entrega cada evento às sessões de qualquer réplica do serviço. O Redis guarda a presença global e distribui a revogação de sessões.

## Conexão

| Item | Valor |
|---|---|
| Endpoints | `/ws` (local, sem gateway) e `/messaging/ws` (pelo Kong, com `strip-path: false`) |
| Origens | qualquer uma (`setAllowedOriginPatterns("*")`) |
| Primeiro frame | em até 10 s (`setTimeToFirstMessage`) |
| Heartbeat | o cliente pede 10s/10s, e o RabbitMQ negocia. O Kong fecha conexões ociosas depois de cerca de 60 s |
| Ordem | `setPreserveReceiveOrder` e `setPreservePublishOrder` mantêm a ordem dos frames de cada cliente |
| Broker | RabbitMQ, porta STOMP 61613, vhost `/` |
| Sessões por usuário | até 4, somadas em todas as réplicas |

### CONNECT

`StompAuthChannelInterceptor.handleConnect`:

1. Lê o header `Authorization`, com ou sem o prefixo `Bearer`. Sem o header, recusa.
2. Decodifica o JWT com o mesmo decoder do HTTP e exige um `sub` UUID.
3. Liga a sessão ao usuário. Um segundo CONNECT na mesma sessão é recusado.
4. Consulta o `api-auth` e exige usuário ativo.
5. Admite a sessão em `LocalWebSocketSessionRegistry.admit`. A quinta sessão do usuário recebe `SESSION_LIMIT_EXCEEDED`, e as outras quatro continuam abertas.

Qualquer falha no CONNECT devolve um frame `ERROR` e fecha a sessão. O token e os detalhes do decoder não vão para o log.

### Frames depois do CONNECT

- A sessão precisa ter feito CONNECT. A expiração do JWT é conferida em todo frame. Um token vencido devolve `ERROR` e fecha a conexão.
- Heartbeat, `UNSUBSCRIBE` e `DISCONNECT` passam direto. O `DISCONNECT` marca a sessão como desconectando no mesmo instante.
- `SEND` aceita só os destinos da tabela de comandos. Outro destino gera `SEND_NOT_ALLOWED`. Um frame com `conversationId` no corpo exige participação atual.
- `SUBSCRIBE` aceita só os tópicos da tabela de destinos. Sem destino, `SUBSCRIBE_DESTINATION_REQUIRED`. Outro destino, `SUBSCRIBE_NOT_ALLOWED`.
- Outros comandos STOMP, como `ACK`, `NACK` e `BEGIN`, geram `COMMAND_NOT_ALLOWED`.
- Uma recusa de `SEND` ou `SUBSCRIBE` descarta só aquele frame e envia o erro para `/topic/users.{userId}.errors`. A conexão continua aberta.
- Na thread do handler, `beforeHandle` confere de novo a expiração, a sessão e o destino. Um frame de sessão revogada é descartado sem aviso.

## Comandos

`MessageWebSocketController`.

| Destino | Payload | Efeito |
|---|---|---|
| `/app/messages.send` | o mesmo corpo de `POST /messaging/messages` | grava a mensagem e envia `MESSAGE_ACK` ao remetente. Ver [MESSAGES.md](./MESSAGES.md#enviar) |
| `/app/typing.started` | `{"conversationId"}` | publica `TYPING_STARTED` |
| `/app/typing.stopped` | `{"conversationId"}` | publica `TYPING_STOPPED` |
| `/app/presence.ping` | sem corpo | não faz nada. Mantém a conexão ativa e não altera a presença |

## Destinos

`StompDestinations`. O RabbitMQ recusa `/` depois de `/topic`, por isso o separador é `.`.

| Tópico | Quem assina | Conteúdo |
|---|---|---|
| `/topic/conversations.{conversationId}` | participantes com acesso atual | eventos de mensagem, presença e digitando da conversa |
| `/topic/users.{userId}.acks` | só o próprio usuário | `MESSAGE_ACK` |
| `/topic/users.{userId}.errors` | só o próprio usuário | `WsErrorPayload` |
| `/topic/users.{userId}.conversations` | só o próprio usuário | `CONVERSATION_UPDATED` e `CONVERSATION_REMOVED` |

- O id de conversa aceita só `[A-Za-z0-9_-]`, e o `userId` precisa ser um UUID em minúsculas. Isso impede assinar os curingas `*` e `#` do RabbitMQ.
- O `SUBSCRIBE` perde os headers `durable`, `persistent`, `auto-delete`, `exclusive` e `x-*`. A fila fica exclusiva e é apagada com a sessão. O cliente não consegue criar uma fila durável que acumule eventos depois de desconectar.

## Eventos

Todo evento usa `WsEventEnvelope`: `type`, `conversationId`, `eventId`, `serverTimestamp` e `payload`.

| `type` | Tópico | Quando | `payload` |
|---|---|---|---|
| `MESSAGE_CREATED` | conversa | mensagem nova do usuário ou do chatbot | `MessageResponseDTO`. `eventId` é o `id` da mensagem |
| `MESSAGE_EDITED` | conversa | edição efetiva | `MessageResponseDTO`, `eventId` novo |
| `MESSAGE_DELETED` | conversa | exclusão efetiva | tombstone, `eventId` novo |
| `MESSAGE_ACK` | `users.{id}.acks` | envio pelo STOMP | `MessageResponseDTO`. `eventId` é o `id` da mensagem |
| `CONVERSATION_UPDATED` | `users.{id}.conversations` | mudança de conversa, de mensagem, de roster ou de status da comunidade. Depois de um PATCH de estado, só para o próprio usuário | `ConversationListItemResponseDTO` do destinatário |
| `CONVERSATION_REMOVED` | `users.{id}.conversations` | perda de participação | `{id, syncEpoch, syncVersion}`, sem roster, conteúdo ou preferências |
| `PRESENCE_SNAPSHOT` | só para a sessão que assinou a conversa | logo depois que o broker registra o `SUBSCRIBE` | `{subscriptionId, presenceEpoch, presenceVersion, users}` |
| `USER_ONLINE`, `USER_OFFLINE` | conversa, em cada conversa do usuário | a primeira ou a última sessão do usuário numa réplica muda | `{userId, presenceEpoch, presenceVersion}` |
| `TYPING_STARTED`, `TYPING_STOPPED` | conversa | ver [Digitando](#digitando) | `{userId}`, sem `eventId` |

`CONVERSATION_UPDATED` vai para todos os participantes com acesso, mesmo os que não estão com a conversa aberta. O serviço refaz a autorização logo antes de entregar.

`WsErrorPayload`: `code`, `message`, `clientMessageId` (quando o erro veio de um envio com correlação) e `traceId` (sempre nulo hoje). Os códigos são os mesmos do REST. Ver [ERRORS.md](./ERRORS.md).

Uma falha de entrega só gera log. Ela nunca desfaz a escrita nem vira erro do comando. O cliente reconcilia pela lista REST com `syncEpoch` e `syncVersion`.

## Filtro de saída

`ResourceOutboundChannelInterceptor` confere cada frame `MESSAGE` antes de mandá-lo ao cliente:

- A sessão precisa estar operacional: admitida, não revogada, sem `DISCONNECT` e com o socket aberto.
- Se o frame pertence a uma conversa, o usuário precisa participar dela agora, segundo o MongoDB.
- Se uma das duas condições falha, o frame é descartado.

O relay manda `ERROR "Connection to broker closed."` quando o RabbitMQ fecha a conexão depois de um `DISCONNECT` do cliente. O filtro descarta esse frame para sessões que já não operam, para que o cliente não trate o fim normal como queda. Para sessões ainda operacionais, que indicam uma queda real do broker, o frame passa.

## Presença

`LocalWebSocketSessionRegistry`, `RedisPresenceStore` e `PresenceService`.

- Um usuário está online quando tem ao menos uma sessão admitida em qualquer réplica. Cada sessão fica em `messenger:presence:{userId}`.
- A sessão só é gravada no Redis se ainda estiver operacional. Um lock local ordena as escritas de cada réplica, para que uma gravação atrasada não recrie uma sessão já apagada.
- `USER_ONLINE` e `USER_OFFLINE` saem quando a primeira ou a última sessão do usuário numa réplica muda. O evento só sai se o estado global ainda for o mesmo do evento.
- `presenceEpoch` e `presenceVersion` vêm do Redis. A versão é alocada antes da leitura. A época só muda se o Redis perder os dados.
- Ao assinar uma conversa, a sessão recebe `PRESENCE_SNAPSHOT` com a presença de todos os participantes com acesso.

Heartbeat e limpeza:

- A cada 30 s, cada réplica renova o próprio registro em `messenger:pods` e regrava as sessões locais. Isso recupera os dados se o Redis os perdeu ou se outra réplica limpou esta por engano.
- Uma réplica sem heartbeat por 90 s é considerada morta. Uma única réplica, com a trava `messenger:reap:{podId}`, apaga as sessões dela e publica `USER_OFFLINE` dos usuários afetados.

Limites conhecidos, marcados com `shortcut:` no código:

- Contar e gravar sessões não é atômico entre réplicas. Dois CONNECTs simultâneos podem admitir a quinta sessão.
- Um usuário de uma réplica morta continua online, e contando no limite, por até cerca de 2 minutos.

Sem Redis, a presença, o snapshot e o limite de sessões usam só a visão da réplica, com época `local-{uuid}`. O health do Redis está desligado, e a réplica continua recebendo tráfego.

## Digitando

`TypingService` e `TypingPresenceService`.

- `typing.started` repetido em menos de 2 s é ignorado, sem consultar o banco nem publicar.
- `typing.started` exige participação e comunidade `ACTIVE`. Não exige conversa `ACTIVE`.
- `typing.stopped` exige só participação. Funciona com a comunidade arquivada.
- O estado de digitando fica em memória na réplica da sessão. Uma varredura a cada 5 s remove entradas com mais de 5 s sem publicar `TYPING_STOPPED`. O cliente precisa expirar o indicador sozinho.
- Quando a última sessão do usuário numa réplica cai, essa réplica publica `TYPING_STOPPED` em todas as conversas em que ele digitava.

## Revogação de sessões

`WebSocketSessionRevoker` implementa a porta `SessionRevoker`. O domínio chama a revogação quando alguém perde participação: remoção ou saída de grupo e remoção ou saída de comunidade.

1. A réplica atual fecha todas as sessões do usuário, inclusive CONNECTs em andamento, com close `1008` (`POLICY_VIOLATION`).
2. A réplica publica `origin:userId` no canal Redis `messenger:revoke`.
3. As outras réplicas fecham as sessões locais do usuário. A réplica de origem ignora a própria mensagem.

O usuário pode reconectar em seguida. Cada assinatura continua sujeita à autorização atual.

`SessionRevocationSubscriber` assina o canal fora do boot e tenta de novo a cada 30 s. Assim, um Redis fora do ar não impede a réplica de subir. Sem Redis, as outras réplicas não recebem a revogação, mas o filtro de saída descarta os eventos das conversas que o usuário perdeu.
