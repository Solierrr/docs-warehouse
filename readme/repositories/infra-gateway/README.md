<p align="center">
  <img src="./assets/readme/banners/kong.png" alt="kong" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/docker.png" width="100" hspace="8" alt="docker" title="docker">
  <img src="./assets/readme/stacks/helm.png" width="100" hspace="8" alt="helm" title="helm">
  <img src="./assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="kubernetes" title="kubernetes">
  <img src="./assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="github-actions" title="github-actions">
</p>

# Entrada e roteamento das APIs

[![License](https://img.shields.io/github/license/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/releases)

O gateway oferece um ponto de entrada para encaminhar chamadas às APIs e aos assistentes da plataforma. No ambiente de QA, ele reúne serviços hospedados separadamente sob caminhos conhecidos. No cluster, a configuração apoia o controlador que recebe as chamadas pelos endereços de cada aplicação.

O repositório mantém a configuração declarativa do Kong e os valores usados na instalação por Helm. A instância de QA funciona sem banco e lê suas rotas ao iniciar. As regras de autenticação das operações continuam nos serviços de destino, enquanto o gateway trata encaminhamento, origens do navegador e identificação das requisições.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras de produto.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, dados e integrações.
- [RUNNING.md](./docs/RUNNING.md), preparação e execução local.
- [API.md](./docs/API.md), autenticação e uso do contrato.
- [DEPLOY.md](./docs/DEPLOY.md), ambientes e publicação.
- [STATUS.md](./docs/STATUS.md), limites observados.
- [ROUTING.md](./flows/ROUTING.md), detalhes do fluxo ou modelo de dados.
- [CONFIG_PUBLISH.md](./flows/CONFIG_PUBLISH.md), detalhes do fluxo ou modelo de dados.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de contribuição.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), relato de vulnerabilidades.
