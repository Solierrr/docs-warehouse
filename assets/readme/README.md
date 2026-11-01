# Assets de README

Banners e ícones de stack para os READMEs e a documentação dos repositórios da Solaria, na identidade visual do projeto (hexágono laranja da Solaria + logo da stack).

- `banners/`, imagens 1858x740, em PNG com moldura branca e cantos transparentes, com o hexágono da Solaria ao lado do logo da stack principal. Vai no topo do README, escolhido pela stack principal do repositório.
- `stacks/`, ícones quadrados de 300 px, em PNG com moldura branca e cantos transparentes, um por tecnologia. Vão numa linha centralizada logo abaixo do banner, sem texto, mostrados com `width="100" hspace="8"`.

**Regra de estabilidade:** um arquivo publicado em `banners/` ou `stacks/` nunca é renomeado nem apagado, porque os READMEs de todos os repositórios apontam para ele pelo link raw da `main`. Para trocar uma imagem, substitua o arquivo mantendo o mesmo nome.

**Regra:** a linha de ícones nunca repete a stack do banner. Se o banner é FastAPI, o ícone do FastAPI não entra na linha; ela mostra só o restante da stack. Quando sobra só a stack do banner, a linha inteira é omitida.

Para usar em qualquer repositório, referencie o arquivo pelo link raw, que funciona porque o `docs-warehouse` é público:

```text
https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/<stack>.png
https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/<stack>.png
```

Exemplo de README já montado: [`readme/repositories/api-notify/README.md`](../../readme/repositories/api-notify/README.md).

## Banners

| Arquivo | Stack |
|---|---|
| `springboot.png` | Spring Boot |
| `spring.png` | Spring Framework (a folha) |
| `java.png` | Java |
| `fastapi.png` | FastAPI |
| `fastify.png` | Fastify |
| `hono.png` | Hono |
| `zod.png` | Zod |
| `brevo.png` | Brevo |
| `vite.png` | Vite |
| `python.png` | Python |
| `gke.png` | Google Kubernetes Engine |
| `react.png` | React |
| `html.png` | HTML5 |
| `storybook.png` | Storybook |
| `swagger.png` | Swagger |
| `openapi.png` | OpenAPI |
| `google.png` | Google |
| `cloudflare-workers.png` | Cloudflare Workers |
| `cloudflare.png` | Cloudflare |
| `render.png` | Render |
| `terraform.png` | Terraform |
| `argocd.png` | Argo CD |
| `kong.png` | Kong |
| `grafana.png` | Grafana |
| `k6.png` | k6 |
| `rabbitmq.png` | RabbitMQ |
| `postgresql.png` | PostgreSQL |
| `neo4j.png` | Neo4j |
| `databricks.png` | Databricks |
| `cloudinary.png` | Cloudinary |
| `github-actions.png` | GitHub Actions |
| `github.png` | GitHub |
| `docker.png` | Docker |
| `npm.png` | npm |
| `pypi.png` | PyPI |
| `kotlin.png` | Kotlin |
| `jetpack-compose.png` | Jetpack Compose |
| `markdown.png` | Markdown |
| `claude.png` | Claude |
| `mcp.png` | Model Context Protocol (MCP), usado no `mcp-database` |
| `infisical.png` | Infisical, usado na documentação de segredos |
| `langchain.png` | LangChain, usado na arquitetura dos serviços de IA |
| `bruno.png` | Bruno, usado em `readme/bruno/` |
| `template.png` | Banner exclusivo do `generic-template`: hexágono com um quadrado translúcido no lugar do logo da stack |

## Ícones de stack

| Arquivo | Stack |
|---|---|
| `java.png` | Java |
| `kotlin.png` | Kotlin |
| `python.png` | Python |
| `typescript.png` | TypeScript |
| `javascript.png` | JavaScript |
| `springboot.png` | Spring Boot |
| `spring-security.png` | Spring Security |
| `fastapi.png` | FastAPI |
| `fastify.png` | Fastify, identificação a confirmar |
| `vite.png` | Vite |
| `maven.png` | Maven, identificação a confirmar |
| `gradle.png` | Gradle |
| `tomcat.png` | Apache Tomcat |
| `mongodb.png` | MongoDB |
| `postgresql.png` | PostgreSQL |
| `redis.png` | Redis |
| `qdrant.png` | Qdrant |
| `firebase.png` | Firebase |
| `firestore.png` | Cloud Firestore, identificação a confirmar |
| `docker.png` | Docker |
| `kubernetes.png` | Kubernetes |
| `gke.png` | Google Kubernetes Engine, identificação a confirmar |
| `gcp.png` | Google Cloud |
| `cloudflare.png` | Cloudflare |
| `render.png` | Render |
| `github-actions.png` | GitHub Actions |
| `infisical.png` | Infisical |
| `opentelemetry.png` | OpenTelemetry |
| `storybook.png` | Storybook |
| `swagger.png` | Swagger |
| `openapi.png` | OpenAPI |
| `bruno.png` | Bruno |
| `api.png` | API genérica |
| `android.png` | Android |
| `cloudinary.png` | Cloudinary |
| `google-calendar.png` | Google Calendar |
| `google-maps.png` | Google Maps |
| `google-translate.png` | Google Translate |
| `gemini.png` | Gemini |
| `openai.png` | OpenAI |
| `groq.png` | Groq, identificação a confirmar |
| `tailwind.png` | Tailwind CSS |
| `jwt.png` | JWT |
| `pydantic.png` | Pydantic |
| `nginx.png` | Nginx |
| `helm.png` | Helm |
| `kubernetes-service.png` | Kubernetes, recurso Service |
| `kubernetes-ingress.png` | Kubernetes, recurso Ingress |
| `kubernetes-pod.png` | Kubernetes, recurso Pod |
| `kubernetes-deployment.png` | Kubernetes, recurso Deployment |
| `kubernetes-secret.png` | Kubernetes, recurso Secret |
| `github-copilot.png` | GitHub Copilot, usado na documentação dos rulesets |
| `mailpit.png` | Mailpit, caixa de e-mail local usada pelo `api-email` |
| `react.png` | React |
| `neo4j.png` | Neo4j |
| `databricks.png` | Databricks |
| `rabbitmq.png` | RabbitMQ |
| `kong.png` | Kong |
| `argocd.png` | Argo CD |
| `grafana.png` | Grafana |
| `terraform.png` | Terraform |
| `k6.png` | k6 |
| `html.png` | HTML5 |
| `markdown.png` | Markdown |
| `github.png` | GitHub |
| `mcp.png` | Model Context Protocol (MCP) |
| `jetpack-compose.png` | Jetpack Compose |
| `hono.png` | Hono |
| `zod.png` | Zod |
| `brevo.png` | Brevo |

Os ícones de React a Jetpack Compose vieram do [theSVG](https://thesvg.org/) (licença MIT, as marcas continuam dos seus donos), convertidos para a mesma moldura dos demais.
