<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudinary.png" width="100" hspace="8" alt="Cloudinary" title="Cloudinary">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Cadastro central da plataforma

[![License](https://img.shields.io/github/license/Solierrr/api-core)](https://github.com/Solierrr/api-core/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-core)](https://github.com/Solierrr/api-core/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-core)](https://github.com/Solierrr/api-core/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-core)](https://github.com/Solierrr/api-core/releases)

Este serviço é o cadastro central da plataforma. Nele ficam as informações de empresas, usuários, técnicos, fornecedores, propostas, contratos de serviço, faturas de energia e certificações, que sustentam a operação de instalação e manutenção de sistemas de energia solar. Os outros serviços e aplicativos consultam e atualizam esses dados por meio dele, com controle de quem pode ver e alterar cada informação.

## Ficha técnica

- **Tipo:** serviço HTTP.
- **Stack:** Java 21 e Spring Boot 4.
- **Dados:** PostgreSQL (`coredb`) e Redis.
- **Integrações:** Cloudinary para imagens e Google Translate para traduções.
- **Autenticação:** JWT de usuário emitido pelo `api-auth`.
- **Decisões:** o schema do `coredb` é mantido no `database-console`, não neste repositório.
- **Ambientes:** QA no Render e produção no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-core/blob/main/docs/ARCHITECTURE.md), estrutura de pastas, camadas e padrões usados no repositório.
- [RUNNING.md](https://github.com/Solierrr/api-core/blob/main/docs/RUNNING.md), como rodar o projeto localmente.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), como funciona o pipeline de deploy da organização.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-core/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
