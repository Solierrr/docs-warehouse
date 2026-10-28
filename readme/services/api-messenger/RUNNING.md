<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/java.png" alt="Java" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/springboot.png" width="100" hspace="8" alt="Spring Boot" title="Spring Boot">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/infisical.png" width="100" hspace="8" alt="Infisical" title="Infisical">
</p>

# Rodando o serviço

O processo Java + Maven comum a todos os repositórios está em [JAVA.md](../../running/JAVA.md). Esta página lista o que o `api-messenger` precisa a mais. A aplicação sobe na porta 8080.

## Dependências

| Dependência | Para quê | Sem ela |
|---|---|---|
| MongoDB com replica set | todo o domínio. A transação de admissão exige replica set | a aplicação sobe, mas as rotas que tocam o banco falham e o readiness fica fora. Num Mongo sem replica set, criar conversa e admitir participantes falham |
| RabbitMQ 4 com plugin STOMP, porta 61613 | relay dos tópicos WebSocket | o tempo real não entrega eventos. Imagem em [`infra-broker`](https://github.com/Solierrr/infra-broker) |
| Redis | presença, limite de sessões e revogação entre réplicas | a réplica usa só a visão local e continua saudável |
| `api-auth` | JWKS e atividade do usuário | toda rota `/messaging/**` falha: 401 sem JWKS, 503 sem a rota de atividade |
| `api-core` | demandante do projeto | só a criação de comunidade falha, com 503 |
| OTel Collector | exportação OTLP | a aplicação funciona e perde a telemetria |

O `api-core` e o `api-messenger` usam a porta 8080 por padrão. Rode um de cada vez ou mude a porta de um deles.

## Variáveis de ambiente

O Infisical é a fonte dos valores. [`.env.example`](https://github.com/Solierrr/api-messenger/blob/main/.env.example) documenta as variáveis por pasta, e `spring.config.import=optional:file:.env[.properties]` lê o `.env` local. `make vault ENV=local` gera o `.env` a partir das pastas `/database` e `/auth`. As demais variáveis precisam ser preenchidas à mão. Ver [Infisical](../../infisical/README.md).

| Pasta | Variável | Padrão |
|---|---|---|
| `/database` | `DB_MONGO_URI` | `mongodb://localhost:27017` |
| `/database` | `DB_MONGO_MESSENGER` | `solaria_messenger_db` |
| `/auth` | `SERVICE_KEY` (ou `SERVICE_KEY_API_MESSENGER`) | vazio. Vai no header `X-Service-Key` para o `api-core` |
| `/service-urls` | `JWT_JWK_SET_URI` | `http://localhost:8081/.well-known/jwks.json` |
| `/service-urls` | `AUTH_SERVICE_URL` | `http://localhost:8081` |
| `/service-urls` | `PERSISTENCE_BASE_URL` | `http://localhost:8080` (URL do `api-core`) |
| `/service-urls` | `PERSISTENCE_CONNECT_TIMEOUT`, `PERSISTENCE_READ_TIMEOUT` | `PT2S`, `PT3S` |
| `/broker` | `RABBITMQ_HOST`, `RABBITMQ_STOMP_PORT` | `localhost`, `61613` |
| `/broker` | `RABBITMQ_USER`, `RABBITMQ_PASSWORD` | `guest`, sem padrão |
| `/broker` | `RABBITMQ_RELAY_AUTO_STARTUP` | `true`. Use `false` só em teste |
| `/redis` | `UPSTASH_MESSENGER_HOST`, `UPSTASH_MESSENGER_PORT` | `localhost`, `6379` |
| `/redis` | `UPSTASH_MESSENGER_USERNAME`, `UPSTASH_MESSENGER_PASSWORD` | `default`, vazio |
| `/otel` | `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` |
| `/otel` | `SERVICE_VERSION`, `DEPLOYMENT_ENVIRONMENT` | `dev`, `local` |
| `/otel` | `OTEL_TRACES_SAMPLING_PROBABILITY` | `1.0` |

O Redis usa timeout de 2 s para comando e conexão, para que um Redis lento não segure os CONNECTs.

`application.properties` ainda declara `app.jwt.service.*` (`SERVICE_JWT_SECRET`, `SERVICE_CLIENT_SECRET` e TTLs) e `app.websocket.max-sessions-per-user`. Nenhum código lê essas propriedades. Ver [STATUS.md](./STATUS.md#configuração-sem-uso).

## Executar

```bash
./mvnw dependency:go-offline
./mvnw spring-boot:run
```

Para obter um JWT pelo Swagger, ative o perfil `dev` e use `POST /dev/login`. Ver [ACCESS.md](./ACCESS.md#login-de-desenvolvimento).

Para subir o ecossistema local completo em Kubernetes (duas réplicas do serviço, `broker`, `messenger-mongo` e `redis`), use o orquestrador `infra-local/solier.ps1`. O manifesto é `k8s-manifests/30-api-messenger.yaml`.

## Testes

```bash
./mvnw test
```

O CI sobe MongoDB 7.0 e Redis 7.4 como serviços. Os testes usam o banco `solaria_messenger_test` e desligam o relay (`app.broker.auto-startup=false`), o tracing e a exportação OTLP.

## Container

O `Dockerfile` compila com `eclipse-temurin:21-jdk` e roda com `eclipse-temurin:21-jre`, com o Infisical CLI instalado. Com `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` definidos, o `entrypoint.sh` executa a aplicação com `infisical run` no ambiente `INFISICAL_ENV` (padrão `qa`). Sem essas variáveis, executa `java -jar app.jar`.

## Health e telemetria

| Item | Configuração |
|---|---|
| Liveness | `/actuator/health/liveness`, com `livenessState` |
| Readiness | `/actuator/health/readiness`, com `readinessState` e `mongo` |
| Redis | `management.health.redis.enabled=false`. A queda do Redis não tira a réplica do balanceador |
| Exposição | só `health` e `info`, sem detalhes nem componentes |
| Métricas | histograma de `http.server.requests` com p50, p95 e p99, faixas de SLO de 50 ms a 5 s, mínimo de 5 ms e máximo de 10 s |
| Traces | amostragem padrão de 100%. O Collector decide o que manter. Requisições do actuator não geram observação |
| Logs | console e appender OpenTelemetry do Logback, com MDC |
| `service.name` | `messager`, igual a `spring.application.name` |

As regras gerais estão no [padrão de health checks](../../../docs/standards/HEALTH.md).

## Publicação

- QA no Render, a partir da branch `qa`: `https://api-messenger-5g2n.onrender.com`. Ver [QA_RENDER.md](../../deploy/QA_RENDER.md).
- Produção no GKE (`solaria-gke`, `us-central1-a`) com ArgoCD. Ver [PROD_GKE_ARGOCD.md](../../deploy/PROD_GKE_ARGOCD.md).
- O Kong roteia o prefixo `/messaging` para o serviço na porta 8080, com `strip-path: false` e os plugins `cors` e `rate-limiting-persistence`. O WebSocket passa por `/messaging/ws`. O prefixo `/internal` não é roteado.
