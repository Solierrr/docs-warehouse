<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Regras de mensagem

Cada mensagem tem uma `sequence` única dentro da conversa, começando em 1. A mensagem do usuário entra por `POST /messaging/messages` ou pelo destino STOMP `/app/messages.send`. Os dois transportes chamam `MessageSendService.sendUserMessage`. A resposta do chatbot entra por `POST /internal/messages`. As rotas ficam em [API.md](./API.md#mensagens).

## Enviar

Validações, na ordem:

1. `messageType` igual a `CHATBOT_TO_USER` gera 400. Esse tipo só entra pela rota interna.
2. O usuário precisa participar da conversa e, num subgrupo, ser membro da comunidade.
3. A conversa precisa estar `ACTIVE`. Senão, 422.
4. `messageType` precisa combinar com a conversa. Senão, 400.

   | Conversa | `messageType` |
   |---|---|
   | `DIRECT` | `USER_TO_USER` |
   | `GROUP` | `USER_TO_GROUP` |
   | `CHAT_BOT` | `USER_TO_CHATBOT` |

5. A comunidade precisa estar `ACTIVE`. Senão, 422.

O servidor define `sender_id` (o `sub` do JWT), `role` (sempre `user`, o campo `role` do corpo é ignorado) e `timestamp`.

`clientMessageId` é opcional e, se vier, precisa ser um UUID canônico. Ele serve só para correlação. O serviço não deduplica: cada chamada grava uma mensagem nova, mesmo com o mesmo `clientMessageId`.

### Sequência e falhas de gravação

`MessageRepository.insertWithPersistedSequence` lê a maior sequência gravada, soma 1 e insere contra o índice único `conversation_sequence_idx`. Uma colisão nesse índice dispara nova tentativa, até 3 no total.

| Falha | Resposta | Gravou? |
|---|---|---|
| leitura da sequência falhou | 503 `DEPENDENCY_UNAVAILABLE` | não |
| 3 colisões de sequência, ou sequência em `Integer.MAX_VALUE` | 409 `CONCURRENT_MODIFICATION` | não |
| outro índice único recusou | 409 `DATA_INTEGRITY_VIOLATION` | não |
| qualquer outra falha | 503 `MESSAGE_PERSISTENCE_UNCERTAIN` | não se sabe. Consulte o histórico antes de reenviar |

Os erros de envio levam `clientMessageId` nas propriedades quando ele foi enviado.

Depois do insert, `last_interaction_at` da conversa é atualizado com `$max`. Se essa atualização falhar, o serviço registra um log e responde 201 normalmente.

### Notificações

Depois da gravação, fora do guard:

1. `MESSAGE_CREATED` em `/topic/conversations.{id}`, com `eventId` igual ao `id` da mensagem.
2. `CONVERSATION_UPDATED` para cada participante com acesso, com preview e não lidas.

No STOMP, o remetente também recebe `MESSAGE_ACK` em `/topic/users.{userId}.acks`, com o mesmo `eventId`. O cliente usa o `eventId` para não mostrar a mesma mensagem duas vezes. Erros do comando vão para `/topic/users.{userId}.errors` sem fechar a conexão. Ver [REALTIME.md](./REALTIME.md).

Uma falha de entrega só gera log. Ela não desfaz a mensagem gravada nem muda a resposta.

## Resposta do chatbot

`MessageSendService.ingestChatbotMessage`, chamado pelo `ai-assistant` em `POST /internal/messages`.

- A conversa precisa existir e ser `CHAT_BOT`. Senão, 400.
- A autorização é feita em nome do dono da conversa (`created_by`), que precisa continuar participante.
- A conversa precisa estar `ACTIVE`.
- O serviço grava `role = assistant`, `message_type = CHATBOT_TO_USER`, `sender_id` nulo e o `metadata` recebido.
- A sequência, as falhas e as notificações seguem as mesmas regras do envio do usuário. Não há `MESSAGE_ACK`.

## Editar e excluir

`MessageMutationService`.

- Só o autor (`sender_id`) altera a mensagem. Senão, 403 com mensagem genérica.
- A conversa precisa ter participação do ator, não ser `CHAT_BOT`, estar `ACTIVE` e ter comunidade `ACTIVE`. Uma conversa `CHAT_BOT` gera 422, inclusive para as mensagens do próprio usuário.
- O serviço relê a mensagem dentro da autorização. Se ela mudou de autor ou de conversa, 409.
- A escrita é condicional ao `mutation_epoch` lido. Cada mutação efetiva soma 1 à época.
- Uma falha técnica gera 503 `MESSAGE_MUTATION_UNCERTAIN`.

| | Editar (`PATCH`) | Excluir (`DELETE`) |
|---|---|---|
| Corpo | `content` de 1 a 8000 caracteres, não branco | sem corpo |
| Efeito | grava o novo `content` e `edited = true` | grava `deleted = true` e remove `content` |
| Sem mudança | mesmo conteúdo: não grava nem notifica | já excluída: não grava nem notifica |
| Mensagem excluída | 422 | sem efeito |
| Tentativas de CAS | 1. Se perder, 409 | até 3 |
| Evento | `MESSAGE_EDITED` com `eventId` novo | `MESSAGE_DELETED` com `eventId` novo e o tombstone |

A exclusão é definitiva. Depois dos eventos de mensagem, os participantes recebem `CONVERSATION_UPDATED`.

## Histórico

`MessageQueryService.getMessagesByConversationId`.

- Exige participação. Funciona com a conversa desativada e com a comunidade arquivada.
- Aceita um único cursor:

  | Parâmetro | Retorno |
  |---|---|
  | `sinceSequence` (≥ 0) | as mensagens com `sequence` maior que o valor |
  | `beforeSequence` (≥ 1) | as N mensagens mais recentes com `sequence` menor que o valor |
  | nenhum | as N mensagens mais recentes |

- Os dois cursores juntos geram 400.
- `limit` vai de 1 a 500. O padrão é 100.
- A resposta sai sempre em ordem crescente de `sequence`.
- Mensagens excluídas aparecem como tombstone, com `content` nulo e `deleted: true`.
- O baseline de admissão não filtra o histórico. Quem entra num grupo lê as mensagens anteriores à entrada.
