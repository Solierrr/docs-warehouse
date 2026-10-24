# Autenticação entre serviços

Toda chamada de um serviço para outro se autentica com uma chave de serviço no cabeçalho `X-Service-Key`. Pessoas (navegador e app) nunca usam chave de serviço: as rotas chamadas por elas usam o JWT do usuário, emitido pelo `api-auth` (`bearerAuth`).

Referência de implementação: `ServiceKeyAuthFilter` e `ServiceKeyProperties` do [`api-notify`](https://github.com/Solierrr/api-notify/tree/main/src/main/java/com/solaria/notify/security) e do [`api-core`](https://github.com/Solierrr/api-core/tree/main/src/main/java/com/solaria/persistence/security).

## Regras

- Cabeçalho `X-Service-Key`, com uma chave por serviço **chamador**. Cada chamador tem a sua; dois chamadores nunca dividem a mesma chave.
- O destino compara a chave recebida com as chaves dos chamadores que aceita, em tempo constante (`MessageDigest.isEqual`, `hmac.compare_digest`, `crypto.timingSafeEqual`).
- Chave com no mínimo 32 caracteres. O serviço valida isso na partida e não sobe com chave curta.
- Destino sem nenhuma chave configurada recusa tudo; nunca libera por falta de configuração.
- Autorização por rota: cada rota declara quais chamadores aceita. Chave válida de um chamador que a rota não aceita é 403.
- Erros no [contrato de erro](./ERRORS.md): 401 `UNAUTHENTICATED` para chave ausente ou inválida e 403 `FORBIDDEN` para chamador não aceito na rota.
- Num serviço que atende pessoas e serviços, as rotas chamadas só por serviço ficam em `/internal/**`, fora do Swagger e dentro do contrato exportado, com o esquema `serviceKey` ([OpenAPI e Swagger](./OPENAPI.md#rotas-internas)).
- Num serviço que só atende outros serviços (como o `api-email`), as rotas mantêm os caminhos atuais, aparecem no Swagger e todas declaram o esquema `serviceKey`.
- A chave nunca aparece em log, resposta, URL nem mensagem de erro.

## Variáveis

| Papel | Variável | Exemplo |
|---|---|---|
| Chamador | `SERVICE_KEY` (a própria chave) | o `api-auth` lê `SERVICE_KEY` e envia no cabeçalho |
| Destino | `SERVICE_KEY_<CHAMADOR>`, uma por chamador aceito | o `api-core` lê `SERVICE_KEY_API_AUTH` |

- `<CHAMADOR>` é o nome do repositório do chamador em maiúsculas, com `-` trocado por `_`: `api-core` vira `API_CORE`, `ai-geographic` vira `AI_GEOGRAPHIC`.
- O valor de `SERVICE_KEY` no chamador é o mesmo de `SERVICE_KEY_<CHAMADOR>` em todos os destinos dele.
- Em documentação e `.env.example`, só os nomes; nunca valores.

## Onde ficam as chaves

- Pasta `/service-keys` do Infisical, nos ambientes `local`, `qa` e `prod`. Cada serviço importa a pasta (`VAULT_FOLDERS`); a raiz do `qa` já importa.
- QA no Render: os serviços que não leem o Infisical na partida recebem as variáveis pelo painel do Render.
- PROD no GKE: o `infra-platform` lê `/service-keys` e monta os segredos de cada serviço.
- Uma chave nova (um chamador novo) entra nos três ambientes antes de qualquer código que a use.

## Ordem segura de troca

Vale para trocar uma chave própria antiga (`Bearer` com token fixo, `X-API-Key`) pelo `X-Service-Key`, e para trocar o valor de uma chave:

1. Criar a chave em `/service-keys` nos três ambientes.
2. O chamador passa a enviar `X-Service-Key`. O destino ainda aceita a forma antiga.
3. O destino passa a exigir `X-Service-Key` e para de aceitar a forma antiga.
4. Remover a variável antiga do Infisical, do Render e do `infra-platform`.

Cada passo vai para a `qa` e para a `main` antes do próximo. Se o destino subir antes do chamador, as chamadas respondem 401.

## Exemplos por stack

### Spring

Copiar o `ServiceKeyAuthFilter` e o `ServiceKeyProperties` do `api-notify`, declarando o filtro como `@Bean` no `SecurityConfig`. Propriedades:

```properties
app.service-keys.api-auth=${SERVICE_KEY_API_AUTH:}
app.service-keys.api-messenger=${SERVICE_KEY_API_MESSENGER:}
```

O filtro dá ao chamador as autoridades `ROLE_SERVICE` e `SERVICE_<chamador>`, e cada rota declara quem aceita:

```java
.requestMatchers("/internal/users/**").hasAuthority(ServiceKeyAuthFilter.authorityOf("api-auth"))
.requestMatchers("/internal/projects/**").hasAuthority(ServiceKeyAuthFilter.authorityOf("api-messenger"))
```

Chamador:

```properties
app.integration.core.service-key=${SERVICE_KEY:}
```

### FastAPI

```python
import hmac

from fastapi import Depends, Security
from fastapi.security import APIKeyHeader

from app.config import settings
from app.errors import ApiError

service_key_header = APIKeyHeader(name="X-Service-Key", scheme_name="serviceKey", auto_error=False)


def require_caller(*callers: str):
    def dependency(key: str | None = Security(service_key_header)) -> str:
        if key:
            for caller, expected in settings.service_keys.items():
                if expected and hmac.compare_digest(key.encode(), expected.encode()):
                    if caller in callers:
                        return caller
                    raise ApiError(403, "FORBIDDEN", "Serviço chamador não autorizado nesta rota.")
        raise ApiError(401, "UNAUTHENTICATED", "Chave de serviço ausente ou inválida.")

    return dependency


@router.get("/internal/routes", dependencies=[Depends(require_caller("api-core", "ai-geographic"))])
async def internal_routes(): ...
```

`settings.service_keys` monta o mapa a partir de `SERVICE_KEY_<CHAMADOR>` e recusa a partida com chave menor que 32 caracteres.

Chamador:

```python
headers = {"X-Service-Key": settings.service_key} if settings.service_key else {}
```

### Fastify

```ts
import { createHash, timingSafeEqual } from "node:crypto";

const digest = (value: string) => createHash("sha256").update(value).digest();
const callers = Object.entries(config.serviceKeys).map(([caller, key]) => [caller, digest(key)] as const);

const requireCaller = (...allowed: string[]) => async (request: FastifyRequest, reply: FastifyReply) => {
  const key = request.headers["x-service-key"];
  const caller = typeof key === "string"
    ? callers.find(([, expected]) => timingSafeEqual(digest(key), expected))?.[0]
    : undefined;
  if (!caller) {
    return reply.code(401).type("application/problem+json")
      .send(problem(request, 401, "UNAUTHENTICATED", "Chave de serviço ausente ou inválida."));
  }
  if (!allowed.includes(caller)) {
    return reply.code(403).type("application/problem+json")
      .send(problem(request, 403, "FORBIDDEN", "Serviço chamador não autorizado nesta rota."));
  }
};

app.post("/emails", { onRequest: requireCaller("api-core", "api-auth") }, sendEmailHandler);
```

`problem` é a função do [contrato de erro](./ERRORS.md#fastify).
