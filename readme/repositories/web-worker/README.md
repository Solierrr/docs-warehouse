<p align="center">
  <img src="./assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/typescript.png" width="100" hspace="8" alt="typescript" title="typescript">
  <img src="./assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="cloudflare" title="cloudflare">
</p>

# Entrada web na borda

[![License](https://img.shields.io/github/license/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/releases)

A entrada de borda recebe visitas ao domínio público, escolhe o idioma adequado e encaminha a navegação para a aplicação. Quando a origem está indisponível, apresenta uma página temporária traduzida em vez de expor uma falha bruta do servidor. Também reconhece caminhos usados para procurar arquivos e painéis que não pertencem ao produto.

O Cloudflare Worker consulta uma origem com nome separado para evitar chamadas recursivas. As rotas e traduções são cópias versionadas do aplicativo web. A detecção de caminhos isca pode alimentar uma lista usada pela proteção de borda, e a telemetria pode acompanhar o percurso da chamada até os serviços.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras de produto.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, dados e integrações.
- [RUNNING.md](./docs/RUNNING.md), preparação e execução local.
- [API.md](./docs/API.md), autenticação e uso do contrato.
- [HONEYPOT.md](./docs/HONEYPOT.md), detalhes do fluxo ou modelo de dados.
- [LANGUAGE.md](./docs/LANGUAGE.md), detalhes do fluxo ou modelo de dados.
- [TELEMETRY.md](./docs/TELEMETRY.md), detalhes do fluxo ou modelo de dados.
- [DEPLOY.md](./docs/DEPLOY.md), ambientes e publicação.
- [STATUS.md](./docs/STATUS.md), limites observados.
- [EDGE_REQUEST.md](./flows/EDGE_REQUEST.md), detalhes do fluxo ou modelo de dados.
- [HONEYPOT.md](./flows/HONEYPOT.md), detalhes do fluxo ou modelo de dados.
- [LANGUAGE_ROUTING.md](./flows/LANGUAGE_ROUTING.md), detalhes do fluxo ou modelo de dados.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de contribuição.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), relato de vulnerabilidades.
