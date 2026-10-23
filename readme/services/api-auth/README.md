<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kotlin.png" width="100" hspace="8" alt="Kotlin" title="Kotlin">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/firebase.png" width="100" hspace="8" alt="Firebase" title="Firebase">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Login e identidade dos usuários

[![License](https://img.shields.io/github/license/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/releases)

Este serviço controla o acesso das pessoas à plataforma. Ele registra novos usuários, confirma a identidade no login, mantém as sessões ativas e permite renovar o acesso sem solicitar a senha novamente. Além do login com e-mail e senha, aceita o acesso por conta externa e oferece uma segunda etapa de verificação. Os demais serviços confiam nele para identificar quem faz cada requisição e conferem essa identidade de forma independente.

## Ficha técnica

- **Tipo:** serviço HTTP.
- **Stack:** Kotlin, Spring Boot 4 e Java 21.
- **Dados:** PostgreSQL (`authdb`) e Redis.
- **Tokens:** JWT assinado com RS256; as chaves públicas são publicadas para que os outros serviços validem os tokens sozinhos.
- **Integrações:** Firebase para o login por conta externa e `api-core` para os dados de cadastro.
- **Ambientes:** QA no Render e produção no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-auth/blob/main/docs/ARCHITECTURE.md), camadas do serviço, padrão de outbox e árvore real do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-auth/blob/main/docs/RUNNING.md), como subir o `api-auth` localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), pipeline de deploy padrão da organização (`main`/`qa`, Docker Hub, ArgoCD).

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
