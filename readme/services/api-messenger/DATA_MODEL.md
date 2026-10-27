<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
</p>

# Modelo de dados

O MongoDB guarda todo o estado de domínio. O Redis guarda só presença e o canal de revogação de sessões. Usuários são identificados pelo `authId`, o UUID do `sub` do JWT do `api-auth`. Conversas, mensagens e comunidades usam ObjectId em hexadecimal.


## Coleções

| Coleção | Classe | Campos | Índices |
|---|---|---|---|
| `conversations` | `Conversation` | `conversation_type`, `participant_ids`, `created_by`, `manager_user_id`, `version`, `title`, `community_id`, `user_type`, `user_details`, `direct_key`, `status`, `started_at`, `last_interaction_at` | `participant_ids`, `community_id`, `uq_direct_pair` |
| `conversation_user_states` | `ConversationUserState` | `conversation_id`, `user_id`, `last_read_sequence`, `muted`, `archived`, `baseline_sequence` | `uq_conversation_user_state` |
| `messages` | `Message` | `conversation_id`, `sender_id`, `client_message_id`, `role`, `message_type`, `content`, `edited`, `deleted`, `mutation_epoch`, `metadata`, `timestamp`, `sequence` | `conversation_id`, `conversation_sequence_idx` |
| `project_communities` | `ProjectCommunity` | `version`, `project_id`, `members[]`, `status`, `created_by`, `created_at`, `updated_at` | `project_id` único, `project_community_member_idx` em `members.user_id` |
| `rating` | `Rating` | `evaluator_id`, `evaluated_id`, `type_rate`, `comment`, `rating`, `status`, `timestamp` | `evaluator_id`, `evaluated_id` |
| `nps` | `Nps` | `conversation_id`, `user_id`, `score`, `classification`, `environment`, `timestamp` | `conversation_id` único, `user_id` |
| `llm_observability` | `LlmObservability` | `node`, `step_order`, `step_type`, `model`, `conversation_id`, `environment`, `tokens_in`, `tokens_out`, `tokens_total`, `latency_ms`, `status`, `error`, `timestamp`, `cost_usd` | `node`, `conversation_id` |
| `sync_clock` | documento via `MongoTemplate` | `_id: "conversation-sync"`, `epoch`, `version` | documento único |

Documentos embutidos:

- `CommunityMember` em `project_communities.members`: `user_id`, `role` (`OWNER`, `ADMIN` ou `MEMBER`) e `joined_at`.
- `MessageMetadata` em `messages.metadata`, preenchido pelo pipeline de IA: `turnId`, `contentAnonymized`, `specialistsUsed` e `workflowSteps`.

## Forma de cada tipo de conversa

| Tipo | Participantes | Gestor | Comunidade | Estado pessoal |
|---|---|---|---|---|
| `DIRECT` | exatamente 2 | não tem | nunca | um por participante |
| `GROUP` | 2 ou mais na criação, pode ficar vazio depois | `manager_user_id`, nulo só com o grupo vazio | opcional (`community_id` define um subgrupo) | um por participante |
| `CHAT_BOT` | só o dono | não tem | nunca | não tem |

`direct_key` é a chave canônica do par: os dois UUIDs ordenados e unidos por `|`. Ela continua gravada quando a direta é desativada.

## Índices únicos

| Índice | Definição | Garante |
|---|---|---|
| `uq_direct_pair` | `direct_key`, parcial para `conversation_type: DIRECT` | uma direta por par, inclusive desativada |
| `conversation_sequence_idx` | `conversation_id` + `sequence` | uma mensagem por posição. A sequência começa em 1 |
| `uq_conversation_user_state` | `conversation_id` + `user_id` | um estado pessoal por participante |
| `project_id` | `project_communities.project_id` | uma comunidade por projeto |
| `conversation_id` | `nps.conversation_id` | um NPS por conversa |

## Valores que só crescem

- `last_interaction_at` é atualizado com `$max`. Uma escrita atrasada não volta o valor.
- `last_read_sequence` é atualizado com `$max`. O cursor de leitura nunca recua.
- `mutation_epoch` cresce 1 a cada edição ou exclusão efetiva. Documento sem o campo vale época 0.
- `sync_clock.version` cresce por `findAndModify` com `$inc`. `epoch` é um UUID gravado no upsert e só muda se o documento for perdido.

## Chaves Redis

O Redis é a mesma instância Upstash do `api-core`, com usuário próprio.

| Chave | Tipo | Uso |
|---|---|---|
| `messenger:presence:{userId}` | HASH `sessionId` para `podId` | presença global e contagem de sessões do usuário |
| `messenger:pod-users:{podId}` | SET de `userId` | usuários com sessão no pod, para limpar o pod morto |
| `messenger:pods` | ZSET `podId` com o último heartbeat em ms | detecção de pod morto |
| `messenger:presence:epoch` | STRING | época da presença |
| `messenger:presence:version` | STRING (contador) | versão da presença |
| `messenger:reap:{podId}` | STRING com `SET NX` e TTL de 10 min | trava para que um só pod limpe o pod morto |
| `messenger:revoke` | canal Pub/Sub, corpo `origin:userId` | revogação de sessões entre pods |

`podId` é um UUID gerado por processo. Um container reiniciado não herda as sessões do anterior.
