# Health checks

Todo serviço responde "estou vivo" e "estou pronto" nos mesmos caminhos. O pronto reflete só o que impede o serviço de atender, e o `environment-status` só marca o ambiente como no ar quando o serviço está pronto de verdade.

## Caminhos

| Stack | Vivo (liveness) | Pronto (readiness) |
|---|---|---|
| Spring | `/actuator/health/liveness` | `/actuator/health/readiness` |
| FastAPI, Fastify e servidores Python | `/health` | `/ready` |

- Rotas públicas, sem autenticação, com `security: []` no contrato OpenAPI.
- No Spring, o agregado `/actuator/health` continua existindo, mas nada depende dele.

## O que entra em cada um

- **Vivo**: só o processo. Nunca consulta dependência; se responde, está vivo.
- **Pronto**: só o que impede o serviço de atender, ou seja, banco e cache que o serviço usa em toda requisição.
- Ficam **fora** do pronto: e-mail (SMTP), OpenTelemetry, serviços opcionais, provedores de LLM com fallback e qualquer dependência cuja falha o serviço contorna. Um serviço com fallback (por exemplo, o grafo do `api-recommendation`, que cai para SQL) continua pronto sem ela.
- A checagem do pronto é rápida (timeout curto por dependência, na casa de 1 a 2 segundos) e não altera dados.

## Resposta

| Situação | Status HTTP | Corpo |
|---|---|---|
| vivo, ou pronto | 200 | `{"status":"UP"}` |
| não pronto | 503 | `{"status":"DOWN"}` |

- Sem detalhes internos (nomes de dependência, mensagens, versões de banco) em ambiente público.
- O `/health` pode incluir a versão do serviço (`{"status":"UP","version":"1.4.0"}`), lida da mesma fonte da [versão do release](./VERSIONING.md).

## Onde cada caminho é usado

| Quem | Caminho | Como |
|---|---|---|
| `environment-status.yml` (repositório `.github`) | pronto | `curl --fail`: 503 conta como falha |
| Render (QA) | pronto | `healthCheckPath` de cada serviço |
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
