<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Rotas HTTP

Referência das rotas, dos campos validados e das respostas de sucesso. As regras de cada operação ficam nos documentos de fluxo indicados em cada seção. O contrato gerado está no Swagger (`/swagger-ui.html`) e em [`openapi.yaml`](https://github.com/Solierrr/api-messenger/blob/main/openapi.yaml). A coleção Bruno fica em [`http/`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md).

As rotas `/messaging/**` exigem `Authorization: Bearer {accessToken}` e um usuário ativo. As rotas `/internal/**` não exigem autenticação de aplicação. Ver [ACCESS.md](./ACCESS.md). Erros seguem [ERRORS.md](./ERRORS.md).

## Conversas

Regras em [CONVERSATIONS.md](./CONVERSATIONS.md).

| Método e rota | Corpo ou parâmetros | Sucesso |
|---|---|---|
| `POST /messaging/conversations/direct` | `recipientId` (UUID, obrigatório) | 201 `ConversationResponseDTO`, também quando reaproveita a direta |
| `POST /messaging/conversations/group` | `title` (obrigatório, até 120 caracteres), `participantIds` (ao menos 1, sem nulos) | 201 `GroupCreationResponseDTO` |
| `POST /messaging/conversations/chatbot-conversations` | `userType` (obrigatório), `userDetails` (mapa livre, opcional) | 201 `ConversationResponseDTO` |
| `GET /messaging/conversations/{id}` | | 200 `ConversationResponseDTO` |
| `GET /messaging/conversations/me` | `archived` (boolean, padrão `false`) | 200 lista de `ConversationListItemResponseDTO`, com os headers `X-Conversation-Sync-Epoch` e `X-Conversation-Sync-Version` |
| `PATCH /messaging/conversations/{id}/state` | `lastReadSequence` (inteiro ≥ 0), `muted`, `archived`. Ao menos um campo, nenhum nulo | 200 `ConversationStateResponseDTO` |
| `POST /messaging/conversations/{id}/participants` | `userIds` (ao menos 1, sem nulos) | 200 `ConversationResponseDTO` |
| `PUT /messaging/conversations/{id}/manager` | `successorUserId` (UUID canônico, obrigatório) | 200 `{conversationId, managerUserId}` |
| `DELETE /messaging/conversations/{id}/participants/{userId}` | `successorUserId` (query, UUID canônico, opcional) | 204 |

Respostas:

- `ConversationResponseDTO`: `id`, `conversationType`, `participantIds`, `createdBy`, `managerUserId`, `title`, `communityId`, `userType`, `userDetails`, `status`, `startedAt`, `lastInteractionAt`.
- `GroupCreationResponseDTO`: `conversation`, `admittedParticipantIds` e `rejectedParticipants` (`userId`, `reasonCode: PARTICIPANT_NOT_ADMITTED`).
- `ConversationStateResponseDTO`: `conversationId`, `syncEpoch`, `syncVersion`, `lastReadSequence`, `unreadCount`, `muted`, `archived`, `effectiveMuted`.
- `ConversationListItemResponseDTO`: ver [CONVERSATIONS.md](./CONVERSATIONS.md#lista-de-conversas-e-sincronização).

## Mensagens

Regras em [MESSAGES.md](./MESSAGES.md).

| Método e rota | Corpo ou parâmetros | Sucesso |
|---|---|---|
| `POST /messaging/messages` | `conversationId` (obrigatório), `messageType` (obrigatório), `content` (obrigatório, até 8000 caracteres), `clientMessageId` (UUID canônico, opcional), `role` (até 32 caracteres, ignorado) | 201 `MessageResponseDTO`, sem header `Location` |
| `PATCH /messaging/messages/{id}` | `content` (obrigatório, não branco, até 8000 caracteres) | 200 `MessageResponseDTO` |
| `DELETE /messaging/messages/{id}` | | 200 `MessageResponseDTO` com o tombstone |
| `GET /messaging/messages/conversation/{conversationId}` | `sinceSequence` (≥ 0) ou `beforeSequence` (≥ 1), nunca os dois. `limit` de 1 a 500, padrão 100 | 200 lista de `MessageResponseDTO` em ordem crescente de `sequence` |

`MessageResponseDTO`: `id`, `conversationId`, `senderId`, `clientMessageId`, `role`, `messageType`, `content`, `edited`, `deleted`, `metadata`, `timestamp`, `sequence`.

## Comunidades

Regras em [COMMUNITIES.md](./COMMUNITIES.md).

| Método e rota | Corpo ou parâmetros | Sucesso |
|---|---|---|
| `POST /messaging/communities` | `projectId` (UUID, obrigatório), `memberIds` (sem nulos, opcional) | 201 `CommunityResponseDTO` |
| `GET /messaging/communities/me` | | 200 lista de `CommunityResponseDTO` |
| `GET /messaging/communities/{id}` | | 200 `CommunityResponseDTO` |
| `GET /messaging/communities/project/{projectId}` | | 200 `CommunityResponseDTO` |
| `PATCH /messaging/communities/{id}` | `status` (`ACTIVE` ou `ARCHIVED`, obrigatório) | 200 `CommunityResponseDTO` |
| `POST /messaging/communities/{id}/members` | `userIds` (ao menos 1, sem nulos), `role` (`ADMIN` ou `MEMBER`, padrão `MEMBER`) | 200 `CommunityResponseDTO` |
| `DELETE /messaging/communities/{id}/members/{userId}` | corpo opcional `{"successors": [{"conversationId", "successorUserId"}]}` | 204 |
| `POST /messaging/communities/{id}/conversations` | `title` (obrigatório, até 120 caracteres), `participantIds` (sem nulos, opcional) | 201 `GroupCreationResponseDTO` |
| `GET /messaging/communities/{id}/conversations` | | 200 lista de `SubgroupMetadataResponseDTO` |

- `CommunityResponseDTO`: `id`, `projectId`, `members` (`userId`, `role`, `joinedAt`), `status`, `createdBy`, `createdAt`, `updatedAt`.
- `SubgroupMetadataResponseDTO`: `id`, `title`, `status`, `participantIds`, `managerUserId`, `startedAt`, `lastInteractionAt`.

## Avaliações e NPS

Regras em [RATINGS_AND_NPS.md](./RATINGS_AND_NPS.md).

| Método e rota | Corpo ou parâmetros | Sucesso |
|---|---|---|
| `POST /messaging/ratings` | `evaluatedId` (UUID, obrigatório), `typeRate` (`PROFISSIONAL` ou `PRODUTO`, obrigatório), `rating` (0.0 a 5.0, obrigatório), `comment` (até 1000 caracteres) | 201 `RatingResponseDTO` |
| `GET /messaging/ratings/{id}` | | 200 `RatingResponseDTO` |
| `GET /messaging/ratings/evaluated/{evaluatedId}` | | 200 lista |
| `GET /messaging/ratings/evaluator/{evaluatorId}` | | 200 lista |
| `PATCH /messaging/ratings/{id}` | `rating` (0.0 a 5.0), `comment` (até 1000 caracteres). Campo nulo mantém o valor | 200 `RatingResponseDTO` |
| `PATCH /messaging/ratings/{id}/status` | `status` (`ACTIVE`, `EXCLUDED` ou `DOWN`, obrigatório) | 200 `RatingResponseDTO` |
| `POST /messaging/nps` | `conversationId` (obrigatório), `score` (0 a 10, obrigatório), `environment` (`LOCAL`, `QA` ou `PROD`, opcional) | 201 `NpsResponseDTO` |

- `RatingResponseDTO`: `id`, `evaluatorId`, `evaluatedId`, `typeRate`, `comment`, `rating`, `status`, `timestamp`.
- `NpsResponseDTO`: `id`, `conversationId`, `userId`, `score`, `classification`, `environment`, `timestamp`.

## Rotas internas

Consumidas pelo `ai-assistant`.

| Método e rota | Corpo ou parâmetros | Sucesso | Regras |
|---|---|---|---|
| `POST /internal/messages` | `conversationId` (obrigatório), `content` (obrigatório), `metadata` (`turnId`, `contentAnonymized`, `specialistsUsed`, `workflowSteps`) | 201 `MessageResponseDTO` | [MESSAGES.md](./MESSAGES.md#resposta-do-chatbot) |
| `POST /internal/observability` | ver [LLM_OBSERVABILITY.md](./LLM_OBSERVABILITY.md#ingestão) | 201 com `Location` | [LLM_OBSERVABILITY.md](./LLM_OBSERVABILITY.md) |
| `GET /internal/observability/{id}` | | 200 | |
| `GET /internal/observability` | no máximo um entre `conversationId`, `node` e `status` | 200 lista | |

## Outras rotas

| Rota | Acesso |
|---|---|
| `GET /actuator/health`, `/actuator/health/liveness`, `/actuator/health/readiness`, `/actuator/info` | público |
| `/swagger-ui.html`, `/v3/api-docs/**` | público |
| `POST /dev/login` | só no perfil `dev`. Ver [ACCESS.md](./ACCESS.md#login-de-desenvolvimento) |
| `/ws`, `/messaging/ws` | WebSocket STOMP. Ver [REALTIME.md](./REALTIME.md) |
