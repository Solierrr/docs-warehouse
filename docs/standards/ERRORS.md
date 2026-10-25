# Contrato de erro

Todo erro HTTP de qualquer serviço chega no mesmo formato, com um código estável que o front traduz nos três idiomas (`pt-BR`, `en-US`, `es-ES`). Os códigos ficam no [catálogo de erros](./ERROR_CODES.md).

Servidores MCP seguem o formato de erro do próprio protocolo e ficam fora deste padrão.

## Formato

Todo erro 4xx e 5xx responde com `Content-Type: application/problem+json`:

| Campo | Obrigatório | Conteúdo |
|---|---|---|
| `type` | sim | `about:blank`, sem URL própria |
| `title` | sim | o mesmo valor de `errorCode` |
| `status` | sim | código HTTP |
| `errorCode` | sim | código estável do [catálogo](./ERROR_CODES.md) |
| `detail` | sim | explicação para quem depura, em português; o front não exibe |
| `instance` | sim | caminho da requisição |
| `timestamp` | sim | ISO 8601 em UTC |
| `traceId` | quando houver | id do trace, para cruzar com os logs |
| `errors` | só em validação | lista de `{field, errorCode, detail}` |

```json
{
  "type": "about:blank",
  "title": "VALIDATION_FAILED",
  "status": 422,
  "errorCode": "VALIDATION_FAILED",
  "detail": "Erro de validação nos campos da requisição.",
  "instance": "/projects",
  "timestamp": "2026-10-24T13:45:00Z",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "errors": [
    { "field": "name", "errorCode": "VALIDATION_FAILED", "detail": "O nome é obrigatório." }
  ]
}
```

- `detail` nunca carrega segredo, stack trace, SQL nem dado pessoal.
- Campos extras específicos de um erro (por exemplo `items` em `INSUFFICIENT_STOCK`) são permitidos e documentados no contrato OpenAPI da operação.

## Códigos (`errorCode`)

- MAIÚSCULAS com sublinhado, sem prefixo de serviço: `PROJECT_NOT_FOUND`, `EMAIL_SEND_FAILED`.
- Únicos na organização: um código tem um significado só. Um código genérico pode ser emitido por vários serviços; um código específico pertence ao serviço que o criou.
- Todo código novo entra no [catálogo](./ERROR_CODES.md) na mesma PR que o cria, porque o catálogo é a fonte das traduções do front.
- Um código publicado não muda de nome. Quando precisar mudar, o antigo fica marcado como legado no catálogo até o front e os serviços deixarem de usá-lo.

### Códigos genéricos

| Código | Status | Quando |
|---|---|---|
| `VALIDATION_FAILED` | 422 | corpo, parâmetro ou cabeçalho inválido |
| `MALFORMED_REQUEST` | 422 | corpo ilegível (JSON malformado, tipo errado) |
| `UNAUTHENTICATED` | 401 | sem credencial, credencial inválida ou expirada |
| `FORBIDDEN` | 403 | autenticado, sem permissão |
| `NOT_FOUND` | 404 | recurso ou rota inexistente |
| `CONFLICT` | 409 | conflito de estado sem código mais específico |
| `RATE_LIMITED` | 429 | limite de requisições atingido |
| `INTERNAL_ERROR` | 500 | erro inesperado |
| `DEPENDENCY_UNAVAILABLE` | 502 ou 503 | dependência externa fora do ar ou com resposta inválida |

### 400 e 422

- 422 para corpo ou parâmetro inválido (o que o framework valida antes de chegar na regra).
- 400 para regra de negócio violada (a requisição é bem formada, mas a operação não é permitida).
- Vale para todas as stacks; o FastAPI já usa 422 para validação e os serviços Spring passam de 400 para 422 nesse caso.

## Por tipo de serviço

1. **APIs REST** (`api-auth`, `api-core`, `api-notify`, `api-recommendation`, `api-google`, `databricks-sync`, `api-email`): todo erro no formato acima.
2. **Agentes de conversa** (`ai-assistant`, `ai-operational`, `ai-geographic`): falha HTTP (token inválido, corpo inválido, serviço fora) no formato acima. O que acontece dentro da conversa não é erro e volta 200, com dois campos na resposta do turno:
   - `outcome`: `ANSWERED`, `REFUSED` (guardrail recusou), `DEGRADED` (provedor caiu e houve fallback) ou `TOOL_FAILED` (uma ferramenta falhou e a resposta saiu sem ela).
   - `reason`: código no mesmo formato do `errorCode`, registrado no catálogo, presente quando `outcome` não é `ANSWERED`.
3. **Serviços de análise de IA** (`ai-validation`, `ai-accessibility`): documento reprovado ou imagem sem descrição possível é resultado (`status: FAILED` com os critérios), não erro. Erro é só falha técnica, no formato acima.

## Front

- O front lê `errorCode` (e `outcome` e `reason` nos agentes) e traduz pelo catálogo. Nunca mostra `detail`.
- Código desconhecido cai na mensagem do genérico do mesmo status.

## Implementação por stack

### Spring

O `ProblemDetailFactory` e o `GlobalExceptionHandler` do `api-core`, do `api-auth` e do `api-notify` são a referência; o `AuthenticationEntryPoint` e o `AccessDeniedHandler` também devolvem `ProblemDetail`.

```java
public ProblemDetail create(HttpStatusCode status, String detail, String errorCode,
                            Map<String, Object> properties, HttpServletRequest request) {
    ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
    problem.setType(URI.create("about:blank"));
    problem.setTitle(errorCode);
    if (request != null) {
        problem.setInstance(URI.create(request.getRequestURI()));
    }
    problem.setProperty("errorCode", errorCode);
    problem.setProperty("timestamp", Instant.now());
    SpanContext span = Span.current().getSpanContext();
    if (span.isValid()) {
        problem.setProperty("traceId", span.getTraceId());
    }
    if (properties != null) {
        properties.forEach(problem::setProperty);
    }
    return problem;
}
```

- `type` é sempre `about:blank`; não montar URL própria. No Spring Framework 7 (Boot 4) o `ProblemDetail` não serializa `type` quando ele não foi definido, então a fábrica define `about:blank` explicitamente.
- `MethodArgumentNotValidException` e `HandlerMethodValidationException` respondem 422 `VALIDATION_FAILED` com `errors` no formato `{field, errorCode, detail}`.

### FastAPI

Handlers para `HTTPException`, `RequestValidationError` e `Exception`. Nos agentes, o código fica na `lib-ai`; nos outros serviços Python, um módulo `errors.py` igual em todos.

```python
from datetime import datetime, timezone

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

GENERIC_BY_STATUS = {
    401: "UNAUTHENTICATED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_FAILED",
    429: "RATE_LIMITED",
    502: "DEPENDENCY_UNAVAILABLE",
    503: "DEPENDENCY_UNAVAILABLE",
}


class ApiError(Exception):
    def __init__(self, status: int, error_code: str, detail: str, **extra):
        self.status = status
        self.error_code = error_code
        self.detail = detail
        self.extra = extra


def problem(request: Request, status: int, error_code: str, detail: str, **extra) -> JSONResponse:
    body = {
        "type": "about:blank",
        "title": error_code,
        "status": status,
        "errorCode": error_code,
        "detail": detail,
        "instance": request.url.path,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        **extra,
    }
    return JSONResponse(body, status_code=status, media_type="application/problem+json")


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(ApiError)
    async def api_error(request: Request, exc: ApiError):
        return problem(request, exc.status, exc.error_code, exc.detail, **exc.extra)

    @app.exception_handler(HTTPException)
    async def http_error(request: Request, exc: HTTPException):
        code = GENERIC_BY_STATUS.get(exc.status_code, "INTERNAL_ERROR")
        return problem(request, exc.status_code, code, str(exc.detail))

    @app.exception_handler(RequestValidationError)
    async def validation_error(request: Request, exc: RequestValidationError):
        errors = [
            {"field": ".".join(str(p) for p in e["loc"][1:]), "errorCode": "VALIDATION_FAILED", "detail": e["msg"]}
            for e in exc.errors()
        ]
        return problem(request, 422, "VALIDATION_FAILED", "Erro de validação nos campos da requisição.", errors=errors)

    @app.exception_handler(Exception)
    async def unexpected_error(request: Request, exc: Exception):
        return problem(request, 500, "INTERNAL_ERROR", "Ocorreu um erro interno inesperado.")
```

O `traceId` entra pelo span atual do OpenTelemetry quando o serviço tem instrumentação.

### Fastify

`setErrorHandler` e `setNotFoundHandler` no `api-email`, mantendo os códigos atuais do serviço.

```ts
const problem = (request: FastifyRequest, status: number, errorCode: string, detail: string, extra = {}) => ({
  type: "about:blank",
  title: errorCode,
  status,
  errorCode,
  detail,
  instance: request.url,
  timestamp: new Date().toISOString(),
  ...extra,
});

app.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const errors = error.validation.map((v) => ({
      field: v.instancePath.replace(/^\//, ""),
      errorCode: "VALIDATION_FAILED",
      detail: v.message ?? "Valor inválido.",
    }));
    return reply.code(422).type("application/problem+json")
      .send(problem(request, 422, "VALIDATION_FAILED", "Erro de validação nos campos da requisição.", { errors }));
  }
  request.log.error(error);
  return reply.code(500).type("application/problem+json")
    .send(problem(request, 500, "INTERNAL_ERROR", "Ocorreu um erro interno inesperado."));
});

app.setNotFoundHandler((request, reply) =>
  reply.code(404).type("application/problem+json").send(problem(request, 404, "NOT_FOUND", "Rota não encontrada.")),
);
```

Os erros próprios do serviço (`UNAUTHENTICATED`, `INVALID_ACTION_URL`, `EMAIL_SEND_FAILED`) usam a mesma função `problem` nas rotas.

### OpenAPI

O esquema `ProblemDetail` é declarado no contrato e referenciado em toda resposta de erro ([OpenAPI e Swagger](./OPENAPI.md#erros)).
