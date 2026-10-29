<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Porta de entrada do site

[![License](https://img.shields.io/github/license/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/web-worker)](https://github.com/Solierrr/web-worker/releases)

Este serviço é executado na borda da rede, na frente do site principal, e trata cada acesso antes que ele chegue à aplicação. Ele encaminha as requisições e, quando a aplicação está indisponível, exibe uma página temporária que informa o problema em vez de um erro genérico. Também define o idioma da página conforme a preferência do visitante e bloqueia acessos automatizados a endereços usados em ataques.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/web-worker/blob/main/docs/ARCHITECTURE.md), arquitetura do repositório e estrutura de pastas.
- [CLOUDFLARE_WORKER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/CLOUDFLARE_WORKER.md), como o Worker é publicado na Cloudflare.
- [OVERVIEW.md](https://github.com/Solierrr/web-worker/blob/main/docs/OVERVIEW.md), como o Worker encaminha a origem e o que precisa estar configurado.
- [LANGUAGE.md](https://github.com/Solierrr/web-worker/blob/main/docs/LANGUAGE.md), escolha de idioma e normalização de rotas.
- [HONEYPOT.md](https://github.com/Solierrr/web-worker/blob/main/docs/HONEYPOT.md), rotas isca, ban e limpeza.
- [TELEMETRY.md](https://github.com/Solierrr/web-worker/blob/main/docs/TELEMETRY.md), logs e envio por OTLP.
- [DEVELOPMENT.md](https://github.com/Solierrr/web-worker/blob/main/docs/DEVELOPMENT.md), como desenvolver e testar.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
