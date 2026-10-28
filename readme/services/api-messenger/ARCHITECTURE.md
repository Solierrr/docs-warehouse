<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
</p>

# Arquitetura do repositório

O código segue portas e adaptadores em três pacotes de topo:

- **`core/`**: modelo, repositórios, casos de uso e integrações com outros serviços. Não importa `rest/` nem `websocket/`. Declara em `core/service/port` as portas de saída que os adaptadores implementam.
- **`rest/`**: adaptador HTTP. Recebe as requisições, valida o corpo e chama os serviços de `core/`. Também concentra segurança HTTP, tratamento de erro e documentação OpenAPI.
- **`websocket/`**: adaptador STOMP. Recebe os comandos `/app/*`, chama os mesmos serviços de `core/` e implementa as portas de saída: publicação de eventos e revogação de sessões.

Os dois adaptadores executam as mesmas regras. Enviar uma mensagem por `POST /messaging/messages` ou por `/app/messages.send` chama `MessageSendService.sendUserMessage`, com os mesmos códigos de erro.

## Decisões de estrutura

- **Serviços por caso de uso, sem par interface e implementação.** Uma conversa tem serviços separados para criar (`ConversationCreationService`), consultar (`ConversationQueryService`), montar a lista (`ConversationProjectionService`), alterar o estado pessoal (`ConversationStatePatchService`), gerir grupo (`GroupManagementService` e `GroupMutationSupport`), gravar a admissão em transação (`ConversationAdmissionService`) e notificar (`ConversationChangeNotifier`).
- **Portas de saída.** `ConversationEventPublisher`, `MessageEventPublisher` e `SessionRevoker` ficam em `core/service/port`. O núcleo decide o que publicar e para quem. `websocket/` só entrega, e uma falha de entrega nunca desfaz a escrita.
- **Controllers finos.** Cada controller implementa uma interface `*OpenApi` com as anotações do Springdoc, valida o corpo com `@Valid` e delega ao serviço.
- **Mappers estáticos.** `ConversationMapper`, `MessageMapper` e os demais são classes `final` sem consulta nem autorização. Não há MapStruct.
- **Erros com código estável.** Toda exceção de domínio herda de `BusinessException` e carrega status HTTP, `errorCode` e propriedades extras. O mesmo objeto vira `ProblemDetail` no HTTP e `WsErrorPayload` no STOMP. Ver [ERRORS.md](./ERRORS.md).
- **Comentários em português**, com Javadoc de classe que resume a responsabilidade e lista as operações.

## Modelo de concorrência

O serviço roda com mais de uma réplica. A correção entre réplicas vem do banco, não de memória.

- **CAS por versão.** `Conversation` e `ProjectCommunity` têm `version`. As escritas usam `@Query` com a versão lida e `@Update` com a próxima. `OptimisticMutation.apply` faz até 3 tentativas, relendo e revalidando entre elas. `Message` usa `mutation_epoch` do mesmo jeito.
- **Índices únicos como última barreira.** Uma direta por par (`uq_direct_pair`), uma sequência por posição (`conversation_sequence_idx`), um estado pessoal por participante (`uq_conversation_user_state`), uma comunidade por projeto e um NPS por conversa.
- **Uma transação Mongo.** `ConversationAdmissionService` grava a conversa e o estado pessoal de cada participante no mesmo commit. É o único `TransactionTemplate` do serviço, criado localmente e não como bean global. Transação exige replica set.
- **Guard local.** `ConversationMutationGuard` é um monitor `synchronized` por JVM que serializa os trechos de domínio. Ele não coordena réplicas. Publicar eventos de dentro dele lança `IllegalStateException`.
- **Notificação depois do commit.** Os serviços publicam fora do guard, depois da escrita, e refazem a autorização logo antes de entregar.
- **Relógio de sincronização no Mongo.** `ConversationSyncClock` aloca a versão na coleção `sync_clock` antes de ler, para que eventos de réplicas diferentes sejam comparáveis. Ver [CONVERSATIONS.md](./CONVERSATIONS.md#lista-de-conversas-e-sincronização).
- **Presença e revogação no Redis**, só com comandos simples, sem Lua. Os atalhos aceitos estão marcados com `shortcut:` no código e descritos em [REALTIME.md](./REALTIME.md#presença).

## Diretórios

### `core/`

| Diretório | Conteúdo |
|---|---|
| `contract/request`, `contract/response` | DTOs usados pelo REST e pelo STOMP. `ConversationListItemResponseDTO` é a mesma projeção na lista REST e no evento `CONVERSATION_UPDATED`. `PatchField` distingue campo ausente de campo nulo no PATCH. |
| `exception` | `BusinessException` e subclasses, uma por `errorCode`. |
| `integration/auth` | `AuthClient` (`POST /auth/login`, só para `/dev/login`) e o `RestClient` da `api-auth`. |
| `integration/user` | `UserAccessClient`: atividade de um usuário e atividade em lote na `api-auth`. |
| `integration/core` | `ProjectAuthorityClient`: consulta se o usuário é demandante do projeto no `api-core`, com `X-Service-Key`. |
| `mapper` | conversão estática de documento para DTO. |
| `model`, `model/enums` | documentos Mongo e enums de domínio. Ver [DATA_MODEL.md](./DATA_MODEL.md). |
| `observability` | `ObservabilityConfig` (propaga o contexto de tracing entre threads) e `OpenTelemetryAppenderInitializer`. |
| `repository`, `repository/projection` | Spring Data para consultas simples, `@Query` com `@Update` para CAS, `@Aggregation` para os lotes de última mensagem e de não lidas, `MongoTemplate` para o estado pessoal. `ConversationIndexRepository` e `MessageIndexRepository` preparam índices no boot. |
| `security/jwt` | `JwtDecoderConfig` e `AccessTokenTypeValidator`. O mesmo decoder serve ao HTTP e ao CONNECT STOMP. |
| `security/rbac` | `RbacAuthorizationService` (usuário atual, dono e participante) e `CommunityPolicy` (papéis da comunidade). |
| `service` | casos de uso transversais: `ConversationAuthorizationService`, `ConversationMutationGuard`, `ConversationUserStateService`, `UserAccessService`, `OptimisticMutation`, `RatingService`, `NpsService` e `LlmObservabilityService`. |
| `service/conversation` | criação, consulta, projeção, estado pessoal, gestão de grupo, admissão, notificação e `ConversationSyncClock`. |
| `service/message` | `MessageSendService`, `MessageMutationService`, `MessageQueryService` e `MessageChangeNotifier`. |
| `service/community` | `CommunityService`, `CommunityMembershipService` e `CommunityGroupCascadeService`. |
| `service/port` | portas de saída implementadas por `websocket/`. |
| `service/state` | records do estado pessoal validado: `OwnedState`, `StateChange` e `AuthorizedStateContext`. |

### `rest/`

| Diretório | Conteúdo |
|---|---|
| `controller` | `ConversationController`, `MessageController`, `CommunityController`, `RatingController`, `NpsController`, `ChatbotMessageController` (`/internal/messages`) e `LlmObservabilityController` (`/internal/observability`). |
| `controller/dev` | `DevAuthController` (`POST /dev/login`), só no perfil `dev`. |
| `dto` | DTOs exclusivos do HTTP: `CommunityConversationRequestDTO`, `ParticipantsRequestDTO` e `ManagerTransferResponse`. |
| `error` | `GlobalExceptionHandler` e `ProblemDetailFactory`. |
| `observability` | `ActuatorSecurityConfig`, `TraceIdResponseFilter` (header `X-Trace-Id`) e o filtro que descarta observações do actuator. |
| `openapi` | `OpenApiConfig` e as interfaces `*OpenApi`. |
| `security` | `SecurityConfig` (cadeias e CORS), `ActiveUserFilter` e os handlers de 401 e 403 em `ProblemDetail`. |

### `websocket/`

| Diretório | Conteúdo |
|---|---|
| `config` | `WebSocketConfig` (endpoints, relay para o RabbitMQ, interceptadores, tempo do primeiro frame), `BrokerProperties` e `SessionRegistryHandlerDecorator`. |
| `controller` | `MessageWebSocketController`: `/app/messages.send`, `/app/typing.started`, `/app/typing.stopped` e `/app/presence.ping`. |
| `security` | `StompAuthChannelInterceptor` (CONNECT e frames seguintes), `StompDestinationAuthorizer` (allowlist e participação), `StompDestinations` (formato dos tópicos) e `ResourceOutboundChannelInterceptor` (filtro de saída). |
| `session` | `LocalWebSocketSessionRegistry` (sessões do pod e limite), `RedisPresenceStore`, `WebSocketSessionRevoker` e `SessionRevocationSubscriber`. |
| `presence` | `PresenceService` (snapshot, online e offline), `TypingService` e `TypingPresenceService`. |
| `publisher` | `StompMessageEventPublisher` e `StompConversationEventPublisher`, as implementações das portas. |
| `error`, `listener`, `event` | `StompErrorHandler`, os listeners de recusa de frame e de desconexão, e os eventos internos de sessão. |
| `dto`, `enums`, `exception` | `WsEventEnvelope`, `WsErrorPayload`, `PresenceSnapshotDTO`, `TypingRequest`, `SessionAdmission` e `StompAuthenticationException`. |

## Árvore do repositório

```Tree do Repositório
├── .github/
│   ├── CODEOWNERS
│   ├── CONTRIBUTING.md
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── workflows/          # ci, quality, sonarqube, release, release-please, qa-sync e workflows da organização
├── docs/
│   ├── ARCHITECTURE.md
│   ├── RUNNING.md
│   └── img/                # diagramas de tópicos, sessões e broker
├── http/                   # coleção Bruno por domínio
├── src/
│   ├── main/
│   │   ├── java/com/solaria/messenger/
│   │   │   ├── MessagerApplication.java
│   │   │   ├── core/
│   │   │   ├── rest/
│   │   │   └── websocket/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── logback-spring.xml
│   └── test/
├── .env.example
├── Dockerfile
├── entrypoint.sh
├── Makefile
├── openapi.yaml
├── pom.xml
├── release-please-config.json
└── sonar-project.properties
```

## CI e entrega

| Workflow | Função |
|---|---|
| `ci.yml` | Em PR e push na `main`, roda os testes com MongoDB 7.0 e Redis 7.4 como serviços e gera cobertura com JaCoCo. |
| `quality.yml` | Checkstyle com `google_checks.xml`. Falha só em severidade `error`. |
| `sonarqube.yml` | Roda depois de um CI verde. |
| `release.yml` | Em push na `main`, publica a imagem Docker pelo workflow reutilizável da organização. |
| `release-please.yml` | Versão semântica (`simple`, versão atual 3.1.0). O comentário `/release` publica. |
| `qa-sync.yml` | Depois de um merge direto na `main`, oferece sincronizar a `qa`. |

As PRs entram primeiro na `qa`. Branch no formato `{tipo}/{descricao}` e commit no formato `{tipo}: {mensagem}`, em minúsculas. O Dependabot abre uma PR por vez, toda segunda-feira, sem versões major.
