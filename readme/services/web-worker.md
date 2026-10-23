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

Este serviço fica na frente do site principal e atende as pessoas antes mesmo de a requisição chegar ao servidor da aplicação. Ele encaminha cada acesso e, se a aplicação estiver fora do ar, mostra uma página temporária explicando o problema, em vez de um erro genérico. Também escolhe o idioma da página de acordo com a preferência de cada visitante e bloqueia acessos de robôs que tentam endereços que nenhuma pessoa de verdade visitaria. A configuração e o funcionamento de cada parte estão nos documentos da seção Aprofunde-se.

## Aprofunde-se no Projeto!

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
