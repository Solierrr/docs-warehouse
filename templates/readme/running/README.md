# templates/readme/running/

Variações de `RUNNING.md` por stack. Diferente de `README.md`/`ARCHITECTURE.md`
(que variam por repositório), o conteúdo de "como rodar localmente" é o mesmo
para todo repositório da mesma stack — copie o arquivo da pasta correspondente
para a raiz do repositório como `RUNNING.md` em vez de escrever um do zero.

| Stack | Pasta | Exemplo de repositório |
|---|---|---|
| Python | `python/` | ai-assistant, ai-validation, api-recommendation, api-mcp |
| Java + Maven (Spring Boot) | `java/` | api-core, api-messenger |
| Kotlin + Maven (Spring Boot) | `kotlin/springboot/` | api-auth |
| Kotlin + Gradle (Jetpack Compose / Android) | `kotlin/jetpack-compose/` | mobile-app |
| TypeScript (Vite) | `typescript/` | web-app |
| Terraform (IaC) | `terraform/` | infra-platform |
| Helm chart | `helm/` | infra-gateway |
| Manifestos ArgoCD (GitOps) | `argocd/` | infra-gitops |
| Manifestos Kustomize | `kustomize/` | infra-otel-collector |

Os quatro últimos não são stacks de aplicação — não há "servidor de
desenvolvimento", só validação/renderização do manifesto antes do merge.

Essa divisão espelha a mesma organização por stack já usada em
[`github/workflow/`](../../../github/workflow/README.md),
[`templates/docker/`](../../docker/) e
[`templates/sonar/`](../../sonar/).
