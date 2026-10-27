<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Regras de conversa

Uma conversa é `DIRECT`, `GROUP` ou `CHAT_BOT`. O acesso depende de estar em `participant_ids` e, num subgrupo, de ser membro atual da comunidade. As regras de comunidade e de subgrupo ficam em [COMMUNITIES.md](./COMMUNITIES.md). As rotas ficam em [API.md](./API.md#conversas).

## Regras comuns

- Uma conversa `DEACTIVATED` aceita leitura e recusa comandos com 422. Nenhuma rota do serviço desativa uma conversa. O status existe em dados antigos e na reativação da direta.
- Uma comunidade `ARCHIVED` bloqueia mensagens, o início de digitando e a administração dos seus subgrupos. Leitura, estado pessoal e saída voluntária continuam permitidos.
- Os comandos administrativos consultam a atividade do ator no `api-auth` (`requireActiveActor`), além do filtro HTTP.
- Os comandos rodam dentro de `ConversationMutationGuard`. As notificações saem depois, fora dele.

## Conversa direta

`ConversationCreationService.createDirectConversation`.

1. `recipientId` precisa ser outra pessoa. Senão, 400 `INVALID_FIELD`.
2. O ator e o destinatário precisam estar ativos no `api-auth`. Um usuário inexistente gera 404 e um inativo gera 403.
3. O serviço busca a direta pela chave canônica do par, inclusive desativada.

Quando a direta já existe:

- O serviço confere tipo, par, ausência de comunidade e chave. Uma divergência gera 409 `DIRECT_IDENTITY_INCONSISTENT`.
- Os dois lados precisam ter estado pessoal válido, com cursor até a última sequência gravada. Senão, 422.
- Se está `ACTIVE`, o serviço devolve a mesma conversa, sem mexer em histórico nem em preferências.
- Se está `DEACTIVATED`, o serviço reativa por CAS (`reactivateDirectIfCurrent`) e muda só o `status`. Um erro técnico nessa escrita gera 503 `DIRECT_REACTIVATION_UNCERTAIN`. Se outra requisição mudou a conversa antes, o serviço relê e só aceita o resultado se ela já estiver `ACTIVE`. Senão, 409 `CONCURRENT_MODIFICATION`.

Quando não existe, o serviço cria a direta na transação de admissão. Se outra requisição criou o mesmo par ao mesmo tempo, o índice `uq_direct_pair` recusa a segunda escrita e o serviço devolve a direta vencedora.

A resposta é 201 nos dois casos. O evento `CONVERSATION_UPDATED` sai só quando a direta foi criada ou reativada. Uma direta não aceita gestão de participantes: adicionar, remover ou trocar o gestor gera 422.

## Grupo avulso

`ConversationCreationService.createGroupConversation`.

1. O criador precisa estar ativo.
2. Os candidatos são os convidados, sem o criador.
3. Entram só os candidatos ativos no `api-auth`, consultados em lote. Os demais voltam em `rejectedParticipants` com `reasonCode: PARTICIPANT_NOT_ADMITTED`, sem dados da conta.
4. O grupo precisa ter o criador e mais um participante aceito. Senão, 422.
5. O criador vira gestor (`manager_user_id`).

A seleção parcial vale só quando o `api-auth` responde. Uma falha técnica do `api-auth` cancela a criação com 503.

`ConversationAdmissionService.createWithInitialStates` grava a conversa e o estado de cada participante numa transação Mongo. Cada estado começa com `baseline_sequence = 0`, `last_read_sequence = 0`, `muted = false` e `archived = false`. A transação revalida status `ACTIVE`, ao menos 2 participantes, criador entre eles e criador como gestor. Se algo falhar, nada fica gravado. Um erro de transação gera 503 `CONVERSATION_PERSISTENCE_UNCERTAIN`. Outra falha técnica gera 503 `DEPENDENCY_UNAVAILABLE` com `conversationId`.

## Gestão de grupo

`GroupManagementService`. Toda escrita usa CAS e revalida a permissão na versão mais recente.

### Adicionar participantes

- O ator precisa estar ativo, participar e ser o gestor atual. O grupo precisa estar `ACTIVE`, e a comunidade também, quando houver.
- `userIds` não aceita nulos. Num subgrupo, todos precisam ser membros da comunidade. Senão, 422.
- Os novos participantes precisam estar ativos, sem seleção parcial: um inexistente gera 404 e um inativo gera 403.
- `admitParticipants` roda na transação. A versão lida precisa ser a atual. Senão, 409. Quem já participa precisa ter estado válido. Se ninguém novo entrou, nada é gravado.
- O estado de quem entra nasce com `baseline_sequence` e `last_read_sequence` iguais à sequência da última mensagem gravada. As mensagens anteriores não contam como não lidas.
- O estado pessoal nunca é apagado. Quem volta ao grupo reaproveita o estado antigo, se ele for válido.
- Erros técnicos geram 503 `ADMISSION_PERSISTENCE_UNCERTAIN` ou `DEPENDENCY_UNAVAILABLE`.

### Transferir a gestão

- O ator precisa estar ativo e ser o gestor de um grupo `ACTIVE`, em comunidade `ACTIVE` quando houver.
- O sucessor precisa ser outro participante, membro da comunidade quando houver e ativo no `api-auth`. Qualquer falha gera 409 `SUCCESSOR_INELIGIBLE`.
- O antigo gestor perde a autoridade na mesma escrita.

### Remover participante ou sair

- Sair exige só participar. Funciona com o grupo desativado e com a comunidade arquivada.
- Remover outra pessoa exige ser o gestor atual de um grupo `ACTIVE`, em comunidade `ACTIVE`.
- Se o alvo já não participa, a operação não grava nada e responde 204.
- O grupo precisa ter um gestor que ainda participa. Senão, 409 `GROUP_MANAGER_UNAVAILABLE`.
- O gestor só sai indicando um sucessor (`successorUserId`). Senão, 409 `SUCCESSOR_REQUIRED`. A exceção é a remoção do último participante por outra pessoa, que deixa o grupo vazio. Esse caso só acontece pela cascata da comunidade.
- Um gestor que já saiu da comunidade não consegue sair sozinho de um subgrupo com outras pessoas: 409 `GROUP_MANAGER_UNAVAILABLE`. Quem sai sozinho depois de sair da comunidade tem o sucessor informado ignorado.
- Um grupo com participantes sempre tem gestor participante, e membro da comunidade quando é subgrupo. Um grupo vazio continua existindo, com `manager_user_id` nulo.

Depois da remoção, o removido recebe `CONVERSATION_REMOVED`, todas as sessões WebSocket dele são derrubadas em todas as réplicas e os participantes restantes recebem `CONVERSATION_UPDATED`. Ver [REALTIME.md](./REALTIME.md#revogação-de-sessões).

## Conversa com o chatbot

`ConversationCreationService.createChatbotConversation`.

- `userType` é obrigatório e livre. `userDetails` é um mapa livre.
- `participant_ids` contém só o dono. Não há gestor nem estado pessoal.
- A gravação é um `save` simples, fora da transação de admissão, porque a admissão exige ao menos 2 participantes.
- O dono recebe `CONVERSATION_UPDATED`.

Numa conversa `CHAT_BOT` não há edição nem exclusão de mensagens, PATCH de estado pessoal ou contagem de não lidas. As respostas do assistente entram por rota interna. Ver [MESSAGES.md](./MESSAGES.md#resposta-do-chatbot).

## Estado pessoal

`ConversationStatePatchService` e `ConversationUserStateService`. Cada participante de `DIRECT` ou `GROUP` tem um `ConversationUserState`.

### PATCH de estado

- Campos `lastReadSequence`, `muted` e `archived`. O DTO distingue campo ausente de campo enviado como `null`.
- Geram 400 `INVALID_FIELD`: corpo ausente, nenhum campo, campo nulo ou de tipo inválido, cursor negativo e cursor maior que a última sequência gravada.
- Uma conversa `CHAT_BOT` gera 422.
- O cursor só avança. Um valor menor que o atual é ignorado.
- Se nada mudou, o serviço não grava nem notifica.
- O evento `CONVERSATION_UPDATED` vai só para o próprio usuário.
- A operação não exige comunidade `ACTIVE`.
- `effectiveMuted` é `muted` ou `archived`.

### Baseline de admissão

O estado nasce na admissão com `baseline_sequence` e `last_read_sequence` iguais à última sequência daquele momento. O baseline é dado gravado, nunca calculado numa leitura posterior. Ele afeta só a contagem de não lidas: quem entra num grupo lê o histórico inteiro.

Um estado é válido quando tem os ids, `baseline_sequence ≥ 0`, `last_read_sequence ≥ baseline_sequence` e `muted` e `archived` preenchidos. Estado ausente, duplicado, inválido ou com cursor além da última sequência gera 422 com a mensagem de baseline indisponível. O serviço não corrige o estado automaticamente.

### Não lidas

Contam as mensagens com `sequence` maior que `last_read_sequence`, não excluídas e não enviadas pelo próprio usuário. As mensagens do chatbot têm `sender_id` nulo e contam. Uma agregação calcula as não lidas de várias conversas e destinatários de uma vez.

## Lista de conversas e sincronização

`ConversationQueryService.findMineSnapshot` e `ConversationProjectionService`.

- A lista traz as conversas em que o usuário está no roster e tem acesso. Num subgrupo, ele precisa ser membro atual da comunidade.
- `archived=false`, o padrão, traz as conversas não arquivadas pelo usuário. Uma conversa `CHAT_BOT` não tem estado e só aparece com `archived=false`.
- A ordem é `lastInteractionAt` decrescente, com nulos no fim, e depois `id`.
- Um estado pessoal inválido em qualquer conversa humana da lista faz a chamada inteira falhar com 422.

Campos de `ConversationListItemResponseDTO`, o mesmo objeto da lista REST e do evento `CONVERSATION_UPDATED`:

| Campo | Regra |
|---|---|
| `id`, `conversationType`, `participantIds`, `createdBy`, `managerUserId`, `title`, `communityId`, `status`, `startedAt` | dados da conversa |
| `communityStatus` | sempre presente, nulo fora de comunidade |
| `lastInteractionAt` | o maior entre o da conversa e o timestamp da última mensagem |
| `lastReadSequence`, `unreadCount`, `muted`, `archived`, `effectiveMuted` | omitidos em `CHAT_BOT` |
| `lastMessage` | sempre presente, nulo sem mensagens. Uma mensagem excluída aparece com `content` nulo e `deleted: true` |
| `syncEpoch`, `syncVersion` | marcadores de sincronização |

`ConversationSyncClock` guarda o relógio na coleção `sync_clock`, compartilhada por todas as réplicas:

- `syncVersion` vem de um `findAndModify` com `$inc`, alocado antes de qualquer leitura. Uma versão maior sempre leu um estado mais novo.
- `syncEpoch` é um UUID criado no primeiro uso. Ele só muda se o documento for perdido. Uma época diferente invalida as versões anteriores e exige uma nova leitura completa.
- Os marcadores aparecem nos headers `X-Conversation-Sync-Epoch` e `X-Conversation-Sync-Version` de `GET /me` (inclusive com a lista vazia), em cada item da lista, na resposta do PATCH de estado e no payload de `CONVERSATION_REMOVED`.

`GET /messaging/conversations/{id}` devolve `ConversationResponseDTO`, sem estado pessoal, e exige participação.
