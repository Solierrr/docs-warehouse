# OpenAPI e Swagger

Toda API HTTP da organização publica um contrato OpenAPI gerado do próprio código, com a mesma estrutura, a mesma autenticação documentada e o mesmo [contrato de erro](./ERRORS.md). O Swagger UI funciona de ponta a ponta e o `web-sandbox` abre todos do mesmo jeito.

Vale para os serviços Spring (springdoc), FastAPI e Fastify (`@fastify/swagger`). Servidores MCP e o protocolo A2A dos agentes não são OpenAPI e ficam fora deste padrão.

## Fonte única

- O contrato é gerado do código. Nenhum `openapi.yaml` escrito à mão.
- O contrato exportado fica versionado na raiz do repositório como `openapi.yaml`, gerado por um comando do próprio repositório (`make openapi`) e conferido no CI: se o arquivo versionado não bate com o que o código gera, o CI falha.
- O comando de exportação não depende de banco, fila nem segredo: sobe só a camada web, com as dependências externas desligadas ou simuladas.
- O `openapi.yaml` traz `info.version`, então a PR de release precisa atualizá-lo junto com a versão do projeto, ou o check de drift quebra depois do release. A linha da versão leva a marca `# x-release-please-version` (escrita pelo próprio comando de exportação) e o arquivo entra no `release-please-config.json` como `extra-files` do tipo `generic`. Não usar o updater `yaml`: ele reformata o arquivo inteiro e o drift quebra do mesmo jeito ([versão e release](./VERSIONING.md#templates-do-release-please)).

## Caminhos

| O quê | Caminho | Observação |
|---|---|---|
| Swagger UI | `/docs` | no Spring, `/docs` redireciona para `/swagger-ui/index.html` |
| Contrato | `/openapi.json` | no Spring, a versão YAML fica em `/openapi.json.yaml` |

Os mesmos caminhos em todas as stacks. O `web-sandbox` lê `/openapi.json` de cada API.

## Exposição por ambiente

- Local e QA: Swagger e contrato abertos.
- PROD: desligados. A variável `DOCS_ENABLED` liga e desliga os dois; o padrão no código é `true` e os manifestos de PROD no `infra-gitops` definem `DOCS_ENABLED=false`.
- O login de pessoas no Swagger é feito só pelo `web-sandbox`, que roda no QA: a pessoa entra uma vez com o login do `api-auth` de QA, e o sandbox renderiza o Swagger UI a partir do `/openapi.json` de cada API e injeta o JWT em toda chamada. Cada serviço aceita CORS da origem do sandbox no QA: a lista de origens vem da variável `CORS_ALLOWED_ORIGINS` (separada por vírgula), com as origens locais (`http://localhost:3000,http://localhost:5173`) como padrão no código. No QA ela inclui `https://web-sandbox-7ug0.onrender.com` e fica no Infisical da `qa`, junto dos outros segredos do serviço; definida só no painel do Render, ela já se perdeu uma vez.

## Rotas internas

- As rotas `/internal/**` ficam fora do Swagger que as pessoas abrem: o contrato servido em `/openapi.json` não as inclui.
- O `openapi.yaml` exportado inclui as rotas internas, com o esquema `serviceKey`. É a documentação delas para os serviços chamadores.
- Na prática, o serviço remove os caminhos `/internal/` ao servir o contrato, e o comando de exportação gera sem esse filtro.
- O mesmo filtro remove as tags que ficaram sem operação (como `Interno`), para o Swagger não listar uma seção vazia.
- Serviço que só atende outros serviços (como o `api-email`) não usa `/internal/`: todas as rotas aparecem no Swagger com o esquema `serviceKey` ([autenticação entre serviços](./SERVICE_AUTH.md#regras)).

## Metadados (`info`)

| Campo | Valor |
|---|---|
| `title` | `Solaria — <repositório>`, por exemplo `Solaria — api-core` |
| `description` | um parágrafo com o que o serviço faz (o mesmo da finalidade do README em `readme/services/`; se o serviço ainda não tem README lá, a do README do repositório), mais como autenticar |
| `version` | a versão do release, lida do build ([versão e release](./VERSIONING.md)); nunca fixa |
| `contact` | `name: Solaria`, `url: https://github.com/Solierrr` |
| `license` | `name: CC0-1.0`, `url: https://creativecommons.org/publicdomain/zero/1.0/` |
| `servers` | QA (URL real do serviço no Render) primeiro e local (`http://localhost:<porta>`) depois, cada um com `description`. O primeiro é o que o Swagger UI seleciona: com o local primeiro, o "Try it out" do QA chama `localhost` |

## Segurança

| Esquema | Tipo | Onde se aplica |
|---|---|---|
| `bearerAuth` | `http`, `scheme: bearer`, `bearerFormat: JWT` (RS256, emitido pelo `api-auth`) | padrão do contrato, em todo serviço que valida JWT |
| `serviceKey` | `apiKey`, `in: header`, `name: X-Service-Key` | rotas `/internal/**` ([autenticação entre serviços](./SERVICE_AUTH.md)) |

- A segurança padrão é declarada na raiz do contrato (`security`).
- Rotas públicas (login, cadastro, JWKS, catálogo aberto, e o `/health` e o `/ready` das stacks que os servem como rotas próprias) declaram `security: []` explicitamente.
- No Spring, o Actuator fica fora do contrato (o padrão do springdoc; não ligar `springdoc.show-actuator`): health e info são da plataforma, não da API.
- Com o login pelo `web-sandbox`, os atalhos `POST /dev/login` deixam de existir.

## Organização

- `tags`: uma por recurso ou domínio, declaradas na raiz com `description`; nomes em português, no vocabulário do produto.
- `operationId`: estável, em inglês e camelCase (`createProject`), único no contrato. Geradores de cliente usam esse nome, então ele não muda sem motivo.
- Toda operação tem `summary` (uma frase) e `description` quando há regra de negócio (quem pode chamar, efeitos colaterais).
- Identificadores em inglês; textos para pessoas em português.

## Contrato de dados

- DTOs com nome próprio (`ProjectResponse`), nunca entidades JPA ou dicionários soltos. No FastAPI, `response_model` em toda rota.
- Campos com `description`, `required`, `format` (`uuid`, `date-time`, `email`), enums nomeados e exemplos realistas, sem dados reais.
- Paginação no formato do Spring em todas as stacks, com os cinco campos (inclusive `totalPages`):

```json
{ "content": [], "page": 0, "size": 20, "totalElements": 0, "totalPages": 0 }
```

## Erros

- Esquema `ProblemDetail` compartilhado, no formato do [contrato de erro](./ERRORS.md), declarado em `components.schemas` e referenciado em toda resposta de erro com o media type `application/problem+json`.
- Respostas de erro por operação: 400 e 422, 401, 403, 404 e 409 quando se aplicam, e 500.
- Os `errorCode` que cada serviço emite ficam no [catálogo](./ERROR_CODES.md). Na operação, a extensão `x-error-codes` lista todos os códigos que ela pode emitir, genéricos incluídos (`UNAUTHENTICATED`, `VALIDATION_FAILED`, `NOT_FOUND`), para o front saber quais traduzir.

```yaml
components:
  schemas:
    ProblemDetail:
      type: object
      required: [type, title, status, errorCode, detail, instance, timestamp]
      properties:
        type: { type: string, example: about:blank }
        title: { type: string, example: PROJECT_NOT_FOUND }
        status: { type: integer, example: 404 }
        errorCode: { type: string, example: PROJECT_NOT_FOUND }
        detail: { type: string, example: Projeto não encontrado. }
        instance: { type: string, example: /projects/7b0c... }
        timestamp: { type: string, format: date-time }
        traceId: { type: string }
        errors:
          type: array
          items:
            type: object
            required: [field, errorCode, detail]
            properties:
              field: { type: string, example: email }
              errorCode: { type: string, example: VALIDATION_FAILED }
              detail: { type: string, example: Formato de e-mail inválido. }
```

## Swagger UI

`persistAuthorization`, `displayRequestDuration`, `tryItOutEnabled` e ordenação alfabética de tags e operações ligados em todas as stacks.

## Qualidade

- Lint do contrato no CI com o Spectral e o ruleset da organização ([`github/openapi/spectral.yaml`](../../github/openapi/spectral.yaml)), pelo workflow reutilizável [`openapi-lint.yml`](../../.github/workflows/openapi-lint.yml). O caller fica em [`github/workflow/common/openapi-lint.yml`](../../github/workflow/common/openapi-lint.yml).
- O ruleset confere: título no padrão, contato e licença, versão semântica, `servers`, segurança declarada, `operationId` único em camelCase, `summary` em toda operação, tags declaradas e descritas, toda operação com resposta de erro, erros em `application/problem+json` (fora `/health` e `/ready`), esquema `ProblemDetail` presente e rotas `/internal/` com `serviceKey`.
- Mesma versão do springdoc nos serviços Spring: a linha 3.x nos serviços em Spring Boot 4 (hoje `3.1.0`, a do piloto e do `api-auth`). Ela loga avisos `Json Processing Exception` ao gerar o contrato para parâmetros com `@Pattern` ou `@Min`, sem efeito no resultado.

## Exemplos por stack

### Spring (springdoc)

`application.properties`:

```properties
springdoc.api-docs.path=/openapi.json
springdoc.swagger-ui.path=/docs
springdoc.api-docs.enabled=${DOCS_ENABLED:true}
springdoc.swagger-ui.enabled=${DOCS_ENABLED:true}
springdoc.swagger-ui.persist-authorization=true
springdoc.swagger-ui.display-request-duration=true
springdoc.swagger-ui.try-it-out-enabled=true
springdoc.swagger-ui.tags-sorter=alpha
springdoc.swagger-ui.operations-sorter=alpha
```

Configuração:

```java
@Configuration
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
@SecurityScheme(name = "serviceKey", type = SecuritySchemeType.APIKEY, in = SecuritySchemeIn.HEADER, paramName = "X-Service-Key")
public class OpenApiConfig {

    @Bean
    OpenAPI openApi(BuildProperties build) {
        return new OpenAPI()
                .info(new Info()
                        .title("Solaria — api-notify")
                        .description("Envia notificações push e guarda o histórico de cada usuário. Autentique com o JWT do api-auth.")
                        .version(build.getVersion())
                        .contact(new Contact().name("Solaria").url("https://github.com/Solierrr"))
                        .license(new License().name("CC0-1.0").url("https://creativecommons.org/publicdomain/zero/1.0/")))
                .servers(List.of(
                        new Server().url("https://<servico>.onrender.com").description("QA"),
                        new Server().url("http://localhost:8080").description("Local")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }

    @Bean
    @Profile("!openapi-export")
    OpenApiCustomizer hideInternalRoutes() {
        return openApi -> {
            openApi.getPaths().keySet().removeIf(path -> path.startsWith("/internal/"));
            Set<String> used = openApi.getPaths().values().stream()
                    .flatMap(path -> path.readOperations().stream())
                    .flatMap(operation -> Optional.ofNullable(operation.getTags()).orElse(List.of()).stream())
                    .collect(Collectors.toSet());
            if (openApi.getTags() != null) {
                openApi.getTags().removeIf(tag -> !used.contains(tag.getName()));
            }
        };
    }

    // Toda resposta 4xx/5xx documentada usa o ProblemDetail do contrato de erro; toda operação documenta o 500
    @Bean
    OpenApiCustomizer problemDetailResponses() {
        return openApi -> {
            if (openApi.getComponents() == null) {
                openApi.setComponents(new Components());
            }
            ModelConverters.getInstance().readAll(new AnnotatedType(ProblemDetailSchema.class))
                    .forEach(openApi.getComponents()::addSchemas);
            Content problem = new Content().addMediaType("application/problem+json", new MediaType()
                    .schema(new Schema<>().$ref("#/components/schemas/" + ProblemDetailSchema.NAME)));
            openApi.getPaths().values().forEach(path -> path.readOperations().forEach(operation -> {
                operation.getResponses().putIfAbsent("500", new ApiResponse().description("Erro interno inesperado"));
                operation.getResponses().forEach((code, response) -> {
                    if (code.startsWith("4") || code.startsWith("5")) {
                        response.setContent(problem);
                    }
                });
            }));
        };
    }
}
```

- `ProblemDetailSchema` é um record só de documentação, com o nome `ProblemDetail` e os campos do esquema acima (e um `ProblemFieldError` para `errors`). Com o customizer, as anotações das operações ficam só com o código e a descrição de cada resposta (`@ApiResponse(responseCode = "404", description = "...")`), sem repetir o `content` em cada uma.

- `BuildProperties` vem do goal `build-info` do `spring-boot-maven-plugin`.
- Rotas internas: `@SecurityRequirement(name = "serviceKey")` no controller ou na interface `*OpenApi`.
- Rotas públicas: `@SecurityRequirements` vazio na operação.
- O `SecurityConfig` libera `/docs`, `/swagger-ui/**`, `/openapi.json`, `/openapi.json/**` e `/openapi.json.yaml` (o YAML não casa com `/openapi.json/**`).
- Exportação: um teste com o perfil `openapi-export` que lê `/openapi.json.yaml` pelo `MockMvc`, põe a marca `# x-release-please-version` na linha de `info.version` e grava `openapi.yaml`; o alvo `make openapi` roda só esse teste (`OPENAPI_CMD` no [Makefile padrão](../../templates/make/maven.mk)).
- Se o repositório tem um `application.properties` de teste, ele substitui o principal: as propriedades `springdoc.*` ficam nos dois, ou o contrato exportado sai diferente do que o serviço serve.

### FastAPI

```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.config import settings
from app.version import VERSION

app = FastAPI(
    title="Solaria — api-google",
    description="Consulta rotas, clima e tradução no Google. Autentique com o JWT do api-auth.",
    version=VERSION,
    contact={"name": "Solaria", "url": "https://github.com/Solierrr"},
    license_info={"name": "CC0-1.0", "url": "https://creativecommons.org/publicdomain/zero/1.0/"},
    servers=[
        {"url": "https://<servico>.onrender.com", "description": "QA"},
        {"url": "http://localhost:8000", "description": "Local"},
    ],
    docs_url="/docs" if settings.docs_enabled else None,
    openapi_url="/openapi.json" if settings.docs_enabled else None,
    redoc_url=None,
    swagger_ui_parameters={
        "persistAuthorization": True,
        "displayRequestDuration": True,
        "tryItOutEnabled": True,
        "tagsSorter": "alpha",
        "operationsSorter": "alpha",
    },
)


def build_openapi(include_internal: bool) -> dict:
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
        servers=app.servers,
        contact=app.contact,
        license_info=app.license_info,
    )
    if not include_internal:
        schema["paths"] = {p: v for p, v in schema["paths"].items() if not p.startswith("/internal/")}
    return schema


def public_openapi() -> dict:
    if app.openapi_schema is None:
        app.openapi_schema = build_openapi(include_internal=False)
    return app.openapi_schema


app.openapi = public_openapi
```

- Esquemas de segurança com `HTTPBearer(scheme_name="bearerAuth")` e `APIKeyHeader(name="X-Service-Key", scheme_name="serviceKey")` nas dependências das rotas.
- `response_model` e `responses={404: {"model": ProblemDetail}}` em toda rota; o esquema `ProblemDetail` é um modelo Pydantic.
- Exportação: `scripts/export_openapi.py` grava `build_openapi(include_internal=True)` em `openapi.yaml`.

### Fastify

```ts
await app.register(swagger, {
  openapi: {
    info: {
      title: "Solaria — api-email",
      description: "Envia e-mails transacionais a partir de modelos. Autentique com a chave de serviço.",
      version: packageJson.version,
      contact: { name: "Solaria", url: "https://github.com/Solierrr" },
      license: { name: "CC0-1.0", url: "https://creativecommons.org/publicdomain/zero/1.0/" },
    },
    servers: [
      { url: "https://<servico>.onrender.com", description: "QA" },
      { url: "http://localhost:3000", description: "Local" },
    ],
    components: {
      securitySchemes: {
        serviceKey: { type: "apiKey", in: "header", name: "X-Service-Key" },
      },
    },
    security: [{ serviceKey: [] }],
  },
});

if (config.docsEnabled) {
  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      persistAuthorization: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
  });
  app.get("/openapi.json", { schema: { hide: true } }, async () => publicContract(app.swagger()));
}
```

- O contrato sai dos schemas das rotas (`body`, `params`, `response`). Onde a validação é feita com zod, os schemas zod são convertidos para a rota (por exemplo com `fastify-type-provider-zod`), para não manter dois modelos. Cada rota declara `tags`, `summary`, `operationId`, `security` e as respostas de erro.
- `publicContract` remove os caminhos `/internal/`; o script de exportação grava `app.swagger({ yaml: true })` sem esse filtro.
