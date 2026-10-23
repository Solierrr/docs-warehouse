<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/k6.png" alt="k6" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Testes de carga

[![License](https://img.shields.io/github/license/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/releases)

Este repositório reúne os testes de carga da plataforma, que simulam muitos acessos simultâneos para medir até onde o sistema suporta. Há dois alvos configurados, a camada que fica na frente do domínio principal e a aplicação web, cada um com um teste rápido de verificação e um teste de estresse. Os testes são executados manualmente, quando necessário. Por gerarem tráfego real, os testes de estresse devem ser executados com cuidado para não afetar quem usa a plataforma.

## Ficha técnica

- **Tipo:** testes de carga.
- **Stack:** k6 com TypeScript.
- **Alvos:** `web-worker` e `web-app`.
- **Ambientes:** sem deploy; execução manual.

## Aprofunde-se no Projeto!

- [HOW_IT_WORKS.md](https://github.com/Solierrr/infra-stress/blob/main/docs/HOW_IT_WORKS.md), alvos, perfis de teste e estrutura.
- [USAGE.md](https://github.com/Solierrr/infra-stress/blob/main/docs/USAGE.md), comandos, limites a respeitar e testes por lista de URLs.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
