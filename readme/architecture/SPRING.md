<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kotlin.png" width="100" hspace="8" alt="Kotlin" title="Kotlin">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
</p>

# Arquitetura do Repositório

Os serviços em Spring Boot seguem uma arquitetura em camadas: o `controller` recebe a requisição HTTP, o `service` concentra a regra de negócio, o `repository` conversa com o banco e o `model` descreve os dados. Não há uma camada extra de interface e implementação para os serviços; a classe de serviço é a própria regra. Cada recurso expõe o seu contrato por uma interface `openapi` própria, usada só para as anotações do Springdoc, o que mantém os controllers limpos. A configuração vem de variáveis de ambiente e os erros saem num formato único.

- **Camadas e pacotes:** `controller`, `service`, `repository`, `model`, `dto` (com `request` e `response`), `config`, `security`, `exception` (com os handlers) e `integration` para as chamadas a outros serviços.
- **Contrato da API:** cada recurso tem uma interface `openapi` que carrega as anotações do Springdoc. O Swagger é gerado a partir delas, e as rotas públicas e as internas ficam em grupos separados.
- **Segurança:** o JWT de usuário, emitido pelo `api-auth` e assinado com RS256, é validado pelo JWKS do `api-auth` (resource server OAuth2). Quando o serviço expõe rotas internas entre serviços, como o `api-messenger`, uma segunda `SecurityFilterChain`, separada por `@Order`, valida um token de serviço. A autorização é por dono do recurso ou por papel.
- **Tratamento de erros:** as exceções de domínio e as falhas de autenticação e de autorização respondem no formato RFC 7807 (`ProblemDetail`), centralizado num `GlobalExceptionHandler`, sem vazar mensagem interna nem stacktrace.
- **Persistência:** PostgreSQL ou MongoDB, conforme o serviço. Não há transação distribuída entre bancos, e os índices ficam declarados no código.
- **Observabilidade e configuração:** logs em `logback-spring.xml`, health check e variáveis lidas do ambiente com os nomes do `.env.example` (ver [segredos e variáveis](../infisical/README.md)).

## Estrutura típica

```text
├── .github/
├── docs/
│   ├── ARCHITECTURE.md
│   └── RUNNING.md
├── http/                    coleção Bruno
├── src/
│   ├── main/
│   │   ├── java/<pacote>/
│   │   │   ├── config/
│   │   │   ├── controller/
│   │   │   ├── dto/{request,response}/
│   │   │   ├── exception/handler/
│   │   │   ├── integration/
│   │   │   ├── model/
│   │   │   ├── openapi/
│   │   │   ├── repository/
│   │   │   ├── security/
│   │   │   └── service/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── logback-spring.xml
│   └── test/
├── Dockerfile
├── Makefile
├── pom.xml
└── README.md
```

Em serviços Kotlin a árvore é a mesma, com `src/main/kotlin`.

## Veja também

- [Como rodar um serviço Java](../running/JAVA.md) e [Kotlin](../running/KOTLIN_SPRINGBOOT.md)
- [Coleção Bruno](../bruno/README.md)
- [Deploy de QA](../deploy/QA_RENDER.md) e [de produção](../deploy/PROD_GKE_ARGOCD.md)
