<p align="center">
  <img src="./assets/readme/banners/springboot.png" alt="springboot" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/kotlin.png" width="100" hspace="8" alt="kotlin" title="kotlin">
  <img src="./assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="postgresql" title="postgresql">
  <img src="./assets/readme/stacks/redis.png" width="100" hspace="8" alt="redis" title="redis">
  <img src="./assets/readme/stacks/firebase.png" width="100" hspace="8" alt="firebase" title="firebase">
  <img src="./assets/readme/stacks/jwt.png" width="100" hspace="8" alt="jwt" title="jwt">
  <img src="./assets/readme/stacks/swagger.png" width="100" hspace="8" alt="swagger" title="swagger">
  <img src="./assets/readme/stacks/bruno.png" width="100" hspace="8" alt="bruno" title="bruno">
</p>

# Identidade e sessões

[![License](https://img.shields.io/github/license/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-auth)](https://github.com/Solierrr/api-auth/releases)

Este serviço cuida da entrada das pessoas na plataforma e da continuidade de suas sessões. Ele permite criar uma conta, entrar com senha ou identidade federada, confirmar o endereço de e-mail e recuperar o acesso. Também controla a autorização do aplicativo profissional e a saída de sessões.

A identidade fica no PostgreSQL. O serviço emite JWT com assinatura assimétrica e publica a chave pública para os demais serviços validarem o acesso. Eventos de cadastro passam por Redis até o cadastro de negócio. Mensagens de confirmação e recuperação são solicitadas ao serviço de e-mail, enquanto o Firebase comprova a identidade federada.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras de produto.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, dados e integrações.
- [RUNNING.md](./docs/RUNNING.md), preparação e execução local.
- [API.md](./docs/API.md), autenticação e uso do contrato.
- [DEPLOY.md](./docs/DEPLOY.md), ambientes e publicação.
- [STATUS.md](./docs/STATUS.md), limites observados.
- [POSTGRES.md](./database/POSTGRES.md), detalhes do fluxo ou modelo de dados.
- [REDIS.md](./database/REDIS.md), detalhes do fluxo ou modelo de dados.
- [SIGN_UP.md](./flows/SIGN_UP.md), detalhes do fluxo ou modelo de dados.
- [LOGIN.md](./flows/LOGIN.md), detalhes do fluxo ou modelo de dados.
- [FEDERATED_LOGIN.md](./flows/FEDERATED_LOGIN.md), detalhes do fluxo ou modelo de dados.
- [MOBILE_PKCE_LOGIN.md](./flows/MOBILE_PKCE_LOGIN.md), detalhes do fluxo ou modelo de dados.
- [TOKEN_REFRESH.md](./flows/TOKEN_REFRESH.md), detalhes do fluxo ou modelo de dados.
- [PASSWORD_RECOVERY.md](./flows/PASSWORD_RECOVERY.md), detalhes do fluxo ou modelo de dados.
- [EMAIL_CONFIRMATION.md](./flows/EMAIL_CONFIRMATION.md), detalhes do fluxo ou modelo de dados.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de contribuição.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), relato de vulnerabilidades.
