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

Este serviço é responsável pelo acesso das pessoas à plataforma. Ele foi idealizado para concentrar em um único lugar a criação de contas, a entrada com e-mail e senha ou com uma conta externa, a confirmação do e-mail e a recuperação de senha, inclusive para quem usa o aplicativo móvel. Dessa forma, os demais serviços não guardam senhas nem repetem essas regras e confiam nele para saber quem está usando o sistema.

A entrada com contas externas usa o Firebase, que confirma a identidade da pessoa antes de o serviço emitir o próprio acesso. Esse acesso é entregue em tokens JWT assinados com chave privada, e a chave pública fica disponível para que os outros serviços validem cada token sem consultar este serviço. O token de acesso tem validade curta e é renovado por um token de longa duração, que é trocado a cada uso. As contas ficam em um banco PostgreSQL próprio, criado na mesma instância usada pelo cadastro central da plataforma. O Redis funciona como fila de eventos, e cada conta nova gera um evento que cria o perfil correspondente no cadastro central, com novas tentativas automáticas quando esse serviço está indisponível.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-auth/blob/main/docs/ARCHITECTURE.md), organização do código, fluxo de eventos e estrutura do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-auth/blob/main/docs/RUNNING.md), como executar o serviço localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), processo de publicação nos ambientes de testes e de produção.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
