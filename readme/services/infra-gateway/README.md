<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/kubernetes.png" width="100" hspace="8" alt="Kubernetes" title="Kubernetes">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/helm.png" width="100" hspace="8" alt="Helm" title="Helm">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/render.png" width="100" hspace="8" alt="Render" title="Render">
</p>

# Porta de entrada dos serviços

[![License](https://img.shields.io/github/license/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-gateway)](https://github.com/Solierrr/infra-gateway/releases)

Este repositório guarda a configuração do gateway da plataforma, o ponto de entrada das requisições destinadas aos serviços. Em produção, o gateway roda dentro do cluster na nuvem; no ambiente de testes, que não possui cluster, ele oferece um endereço único e encaminha cada requisição ao serviço correspondente, no mesmo formato de produção. Assim, quem consome os serviços não precisa saber onde cada um está hospedado.

## Ficha técnica

- **Tipo:** infraestrutura.
- **Gateway:** Kong.
- **Produção:** ingress do GKE, instalado pelo `infra-platform` com o Helm chart do Kong.
- **QA:** Kong sem banco de dados, como serviço Docker no Render.
- **Ambientes:** Render a partir da `main` e GKE.

## Aprofunde-se no Projeto!

- [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md), deploy de QA no Render.
- [ENVIRONMENTS.md](https://github.com/Solierrr/infra-gateway/blob/main/docs/ENVIRONMENTS.md), como o gateway roda em QA e em produção.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
