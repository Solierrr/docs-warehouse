<p align="center">
  <img src="./assets/readme/banners/render.png" alt="Render" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
  <img src="./assets/readme/stacks/infisical.png" width="100" hspace="8" alt="Infisical" title="Infisical">
</p>

# Manutenção de serviços ativos

[![License](https://img.shields.io/github/license/Solierrr/infra-keepalive)](https://github.com/Solierrr/infra-keepalive/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-keepalive)](https://github.com/Solierrr/infra-keepalive/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-keepalive)](https://github.com/Solierrr/infra-keepalive/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-keepalive)](https://github.com/Solierrr/infra-keepalive/releases)

Este repositório mantém uma rotina periódica de contato com serviços do ambiente de QA. O objetivo é reduzir a hibernação dos serviços hospedados no plano gratuito e o tempo de espera de quem os usa para validar mudanças. Ao fim de cada execução, a rotina informa quais serviços responderam e sinaliza falhas.

O GitHub Actions agenda a execução e carrega do Infisical os endereços configurados para QA. Um script Bash consulta cada endereço por HTTP e tenta novamente quando há falha. A lista depende da configuração do ambiente e não fica fixa no código. O resultado aparece no histórico de execuções do workflow.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras da rotina.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, integrações e comportamento técnico.
- [RUNNING.md](./docs/RUNNING.md), execução e verificações locais.
- [DEPLOY.md](./docs/DEPLOY.md), agendamento e configuração da execução no GitHub.
- [STATUS.md](./docs/STATUS.md), limites observados no código.
- [Fluxo](./flows/PING_CYCLE.md), etapas e falhas de cada ciclo.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão pelo responsável.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar uma vulnerabilidade.
