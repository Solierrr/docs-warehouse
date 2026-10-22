<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kotlin.png" width="100" hspace="8" alt="Kotlin" title="Kotlin">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
</p>

# Arquitetura de um serviço Spring Boot

README reutilizável, usado como base do `ARCHITECTURE.md` das APIs em Spring Boot (`api-auth`, `api-core`, `api-messenger` e as próximas). Os serviços seguem uma arquitetura em camadas: o `controller` recebe a requisição HTTP, o `service` concentra a regra de negócio, o `repository` fala com o banco e o `model` descreve os dados. Não há uma camada extra de interface e implementação para os serviços; a classe de serviço é a própria regra. Escreva o documento em português, em parágrafos corridos, com no mínimo 60 palavras na introdução e quatro bullets de decisões.

## O que descrever

- **Camadas e pacotes.** Diga quais pacotes existem em `controller`, `service`, `repository`, `model`, `dto`, `config`, `security`, `exception` e `integration`, e o que cada um faz neste serviço.
- **Contrato da API.** Cada recurso implementa uma interface `openapi` própria, só com as anotações do Springdoc, para manter o controller limpo. Liste os endpoints públicos e os internos, e como cada grupo se autentica.
- **Segurança.** Quando há rotas de usuário e rotas entre serviços, use duas `SecurityFilterChain` separadas por `@Order`: uma valida o JWT do usuário emitido pelo `api-auth` (JWKS) e outra valida o token de serviço (M2M). Autorização por dono do recurso ou por papel, e onde isso é resolvido.
- **Persistência.** Qual banco (PostgreSQL ou MongoDB), como os agregados são modelados e quais índices existem. Sem transação distribuída entre bancos.
- **Erros.** Resposta no formato RFC 7807 (`ProblemDetail`), centralizada num `GlobalExceptionHandler`, sem vazar mensagem nem stacktrace.
- **Integrações.** Quem chama este serviço e quem ele chama, e o que cada chamada espera.
- **Observabilidade.** Logs estruturados (`logback-spring.xml`), health check e, quando houver, métricas e traces para o coletor.
- **Configuração.** Variáveis lidas do ambiente, com os nomes do `.env.example` (ver [segredos e variáveis](../infisical/README.md)).

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

## Checklist antes de abrir o Pull Request

- A árvore do documento bate com a árvore real do repositório.
- Cada rota está no grupo certo (pública, interna ou de administração) e diz como se autentica.
- Nenhum valor de segredo aparece no texto; só os nomes das variáveis.
- Pontos que o código não confirma estão marcados como `{a confirmar: ...}`, nunca afirmados.

## Veja também

- [Como rodar um serviço Java](../running/java.md) e [Kotlin](../running/kotlin-springboot.md)
- [Coleção Bruno](../bruno/README.md)
- [Deploy de QA](../deploy/qa-render.md) e [de produção](../deploy/prod-gke-argocd.md)
