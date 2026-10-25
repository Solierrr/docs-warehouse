# Health checks

Todo serviço responde "estou vivo" e "estou pronto" nos mesmos caminhos. O pronto reflete só o que impede o serviço de atender, e o `environment-status` só marca o ambiente como no ar quando o serviço está pronto de verdade.

## Caminhos

| Stack | Vivo (liveness) | Pronto (readiness) |
|---|---|---|
| Spring | `/actuator/health/liveness` | `/actuator/health/readiness` |
| FastAPI, Fastify e servidores Python | `/health` | `/ready` |

- Rotas públicas, sem autenticação. No FastAPI e no Fastify entram no contrato OpenAPI com `security: []`; no Spring o Actuator fica fora do contrato ([OpenAPI](./OPENAPI.md#segurança)).
- No Spring, o agregado `/actuator/health` continua existindo, mas nada depende dele.

## O que entra em cada um

- **Vivo**: só o processo. Nunca consulta dependência; se responde, está vivo.
- **Pronto**: só o que impede o serviço de atender, ou seja, banco e cache que o serviço usa em toda requisição.
- Ficam **fora** do pronto: e-mail (SMTP), OpenTelemetry, serviços opcionais, provedores de LLM com fallback e qualquer dependência cuja falha o serviço contorna. Um serviço com fallback (por exemplo, o grafo do `api-recommendation`, que cai para SQL) continua pronto sem ela.
- A checagem do pronto é rápida e não altera dados. Onde a stack deixa escolher, o timeout por dependência fica na casa de 1 a 2 segundos. No Spring o indicador do Mongo espera o `serverSelectionTimeoutMS` do driver, que não se muda só para o health (vale para todas as operações); fica o padrão do driver.

## Resposta

| Situação | Status HTTP | Corpo |
|---|---|---|
| vivo, ou pronto | 200 | `{"status":"UP"}` |
| não pronto | 503 | `{"status":"DOWN"}` |

- No contrato OpenAPI (FastAPI e Fastify), o `/ready` documenta o 503 com `application/json` e o mesmo esquema do 200 (`{"status"}`), não com `ProblemDetail`. O ruleset do Spectral isenta `/health` e `/ready` da regra de erro em `application/problem+json`.

- Sem detalhes internos (nomes de dependência, mensagens, versões de banco) em ambiente público.
- O `/health` pode incluir a versão do serviço (`{"status":"UP","version":"1.4.0"}`), lida da mesma fonte da [versão do release](./VERSIONING.md).

## Onde cada caminho é usado

| Quem | Caminho | Como |
|---|---|---|
| `environment-status.yml` (repositório `.github`) | pronto | `curl --fail`: 503 conta como falha |
| Render (QA) | pronto | `healthCheckPath` de cada serviço (no Spring, `/actuator/health/readiness`; o agregado também funciona, mas inclui indicadores que não deveriam derrubar o deploy) |
| GKE (PROD) | os dois | `readinessProbe` HTTP no pronto e `livenessProbe` HTTP no vivo, no lugar dos probes TCP |
| `infra-keepalive` | vivo | ping periódico para o Render não hibernar; acordar o serviço não depende das dependências dele |

Exemplo de probes no `infra-gitops` (Spring):

```yaml
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: http
  periodSeconds: 10
  failureThreshold: 3
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: http
  initialDelaySeconds: 30
  periodSeconds: 20
  failureThreshold: 3
```

## Exemplos por stack

### Spring

```properties
management.endpoint.health.probes.enabled=true
management.endpoint.health.show-details=never
management.endpoint.health.group.liveness.include=livenessState
management.endpoint.health.group.readiness.include=readinessState,db
management.health.mail.enabled=false
```

- Acrescentar ao grupo `readiness` só os indicadores essenciais do serviço (`db`, `redis`, `mongo`), um por um. Nunca `mail`.
- **MongoDB no Atlas:** o indicador padrão do Spring Boot 4 roda `hello` em todos os bancos que o usuário lista, inclusive `local`, e o usuário do Atlas não tem permissão nele: o health fica `DOWN` para sempre e o deploy do Render esgota o tempo. Desligar o padrão (`management.health.mongo.enabled=false`) e registrar um indicador próprio com o nome `mongo` (bean `mongoHealthIndicator`), que faz `ping` só no banco do serviço; o grupo `readiness` continua com `mongo`. Referência: `MongoPingHealthIndicator` do `api-notify`.
- O OpenTelemetry fica fora do health, e a exportação também não pode depender de um coletor que não existe: sem `OTEL_EXPORTER_OTLP_ENDPOINT` (o caso do QA no Render), o serviço tenta `localhost:4318` e enche o log de erros a cada poucos segundos. Até o padrão de observabilidade sair, o QA define o endpoint ou desliga a exportação (`management.otlp.metrics.export.enabled=false` e `management.tracing.export.enabled=false`, e o appender de logs OTLP só com endpoint definido).
- O `SecurityConfig` libera `/actuator/health/**`.

### FastAPI

```python
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.db import ping_database
from app.version import VERSION

router = APIRouter(tags=["Saúde"])


@router.get("/health", summary="Indica se o processo está vivo", operation_id="getHealth", openapi_extra={"security": []})
async def health() -> dict:
    return {"status": "UP", "version": VERSION}


@router.get("/ready", summary="Indica se o serviço está pronto para atender", operation_id="getReady", openapi_extra={"security": []})
async def ready() -> JSONResponse:
    try:
        await ping_database(timeout=2)
    except Exception:
        return JSONResponse({"status": "DOWN"}, status_code=503)
    return JSONResponse({"status": "UP"})
```

### Fastify

```ts
app.get("/health", { schema: { tags: ["Saúde"], summary: "Indica se o processo está vivo", operationId: "getHealth", security: [] } },
  async () => ({ status: "UP", version: packageJson.version }));

app.get("/ready", { schema: { tags: ["Saúde"], summary: "Indica se o serviço está pronto para atender", operationId: "getReady", security: [] } },
  async (_request, reply) => {
    const ok = await isSmtpReachable({ timeoutMs: 2000 });
    return reply.code(ok ? 200 : 503).send({ status: ok ? "UP" : "DOWN" });
  });
```

No `api-email`, o SMTP é a dependência que impede o serviço de atender, então entra no pronto.
