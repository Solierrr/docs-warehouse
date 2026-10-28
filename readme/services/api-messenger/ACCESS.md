<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
</p>

# Acesso e autorização

As rotas `/messaging/**` exigem o JWT de acesso do `api-auth` e um usuário ativo. As rotas `/internal/**` não têm autenticação de aplicação: a proteção é a rede, porque o Kong só roteia o prefixo `/messaging`. Dentro de cada operação, o acesso depende da participação gravada no MongoDB e, nas comunidades, do papel do usuário.

## Cadeias de filtros

| Ordem | Escopo | Regra |
|---|---|---|
| `@Order(0)` | endpoints do actuator | `health` e `info` liberados. O resto é negado (`ActuatorSecurityConfig`). |
| `@Order(1)` | `/internal/**` | `permitAll`. |
| `@Order(1)`, perfil `dev` | `/dev/login` | `permitAll`. |
| `@Order(2)` | demais rotas | resource server OAuth2. Swagger (`/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`) e os endpoints WebSocket `/ws` e `/messaging/ws` são liberados, porque a autenticação do WebSocket acontece no CONNECT STOMP. O resto exige JWT. |

Todas as cadeias são stateless e com CSRF desligado.

CORS, configurado em `SecurityConfig`:

- Origens de `app.cors.allowed-origins`. O padrão é `http://localhost:3000,http://localhost:5173`.
- Métodos `GET`, `POST`, `PUT`, `PATCH`, `DELETE` e `OPTIONS`.
- Headers aceitos: `Authorization`, `Content-Type` e `apikey`.
- Headers expostos: `X-Trace-Id`, `X-Conversation-Sync-Epoch` e `X-Conversation-Sync-Version`.
- O endpoint STOMP aceita qualquer origem (`setAllowedOriginPatterns("*")`).

## Validação do JWT

`JwtDecoderConfig` cria um `NimbusJwtDecoder` usado pelo HTTP e pelo CONNECT STOMP. Ele valida:

- a assinatura RS256 com a chave do JWKS em `JWT_JWK_SET_URI`.
- o issuer `solaria-auth` e a expiração.
- a claim `token_type` igual a `access` (`AccessTokenTypeValidator`). Um refresh token recebe 401.

O `sub` precisa ser um UUID canônico. No HTTP, `ActiveUserFilter` devolve 401 quando não é. No STOMP, o CONNECT falha.

## Usuário ativo

`ActiveUserFilter` roda depois do `BearerTokenAuthenticationFilter`, em toda requisição HTTP autenticada. Ele chama `GET /internal/users/{authId}/activity` no `api-auth`, sem cache.

| Resposta do `api-auth` | Resultado |
|---|---|
| usuário ativo | segue para o controller |
| 404 | 403 `UNAUTHORIZED_ACCESS`, usuário não cadastrado na Auth |
| `active: false` | 403 `UNAUTHORIZED_ACCESS`, usuário inativo |
| falha técnica ou corpo inválido | 503 `DEPENDENCY_UNAVAILABLE` |

O filtro não roda no Swagger nem nos endpoints WebSocket. No STOMP, a atividade é consultada só no CONNECT. Ver [REALTIME.md](./REALTIME.md#conexão).

## Modelo de autorização

Não existe RBAC por permissão. O acesso é decidido por participação e por propriedade, e na comunidade também pelo papel.

`RbacAuthorizationService`:

- `currentUserId()` lê o `sub` do JWT. Sem autenticação, devolve 403.
- `requireOwnResource` exige que o usuário seja o dono do recurso. É usado para autor de mensagem e avaliador.
- `requireParticipant` exige que o usuário esteja na lista informada.
- Essas negações respondem 403 com o texto genérico "O objeto da operação não foi encontrado.", que não revela se o recurso existe.

`ConversationAuthorizationService.requireParticipant`:

1. A conversa precisa existir. Senão, 404.
2. O usuário precisa estar em `participant_ids`. Senão, 403.
3. Se a conversa tem `community_id`, o usuário precisa ser membro atual da comunidade. Senão, 403. Essa regra corta o acesso a um subgrupo assim que o usuário sai da comunidade, mesmo antes de a cascata tirá-lo do roster.

A autorização sempre lê o estado atual no MongoDB, nunca a sessão WebSocket. O serviço refaz a checagem antes de entregar cada evento e em cada frame de saída para o cliente.

`CommunityPolicy` concentra as regras de papel: `requireMember`, `requireAdmin` (`OWNER` ou `ADMIN`), `requireOwner` e `requireRemovalAuthority`. Ver [COMMUNITIES.md](./COMMUNITIES.md#papéis).

## Chamadas a outros serviços

| Destino | Chamada | Erros |
|---|---|---|
| `api-auth` | `GET /internal/users/{authId}/activity` | 404 vira `RESOURCE_NOT_FOUND`. Outro status, falha de rede ou corpo inválido vira 503 `DEPENDENCY_UNAVAILABLE`. |
| `api-auth` | `POST /internal/users/activity/batch` com `{"authIds": [...]}` | A resposta precisa listar cada id pedido exatamente uma vez, em `users` ou em `missingAuthIds`. Senão, 503 `DEPENDENCY_UNAVAILABLE`. |
| `api-auth` | `POST /auth/login` | só para `/dev/login`. Uma falha HTTP vira `AuthIntegrationException`. |
| `api-core` | `GET /internal/technical-projects/{projectId}/requester-access/{authId}` | 403 vira 403. 404 vira 404. Outro status ou timeout vira 503 `DEPENDENCY_UNAVAILABLE`. |

Os dois clientes usam timeout de conexão de 2 s e de leitura de 3 s. O cliente do `api-core` envia `X-Service-Key` quando `SERVICE_KEY` (ou `SERVICE_KEY_API_MESSENGER`) está configurada, conforme o [padrão de autenticação entre serviços](../../../docs/standards/SERVICE_AUTH.md).

## Login de desenvolvimento

No perfil `dev`, `POST /dev/login` repassa `{email, password}` para `POST /auth/login` do `api-auth` e devolve os tokens. Ele permite obter um JWT pelo Swagger do próprio serviço.
