<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Recomendações para o marketplace

[![License](https://img.shields.io/github/license/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/releases)

Este serviço decide o que aparece nas telas de recomendação do marketplace: quais profissionais, ofertas de placas solares e fornecedores são mostrados e em que ordem. Ele usa as relações entre esses itens para montar a lista mais relevante e, quando essa base de relações não está disponível, ainda responde com uma seleção de itens elegíveis, para que a tela nunca fique vazia. Ele só lê as informações, nunca as altera. Os detalhes técnicos ficam nas seções abaixo e na documentação de arquitetura.

- **Três feeds**, `GET /feeds/professionals`, `GET /feeds/offers` e `GET /feeds/suppliers` devolvem
  os itens ranqueados por uma estratégia (`strategy`) e aceitam `company_id` e, quando faz sentido,
  `profession_id` ou `local_unit_id`. Exigem o header `X-Recommendation-Key` e são pensados para
  chamada servidor-a-servidor pelo `api-core`; a chave não pode ir para o navegador.
- **Feeds públicos**, `GET /public/feeds/{professionals|offers|suppliers}` não exigem chave, nunca
  tocam o Neo4j e respondem com `Cache-Control: public` (e `stale-if-error`) para que a Cloudflare
  atenda os anônimos sem chegar à origem.
- **Fallback SQL**, quando o grafo está fora do ar, sem snapshot ou não configurado, os feeds
  autenticados respondem com `source: "fallback"` em vez de erro: uma amostra aleatória entre os
  melhores itens elegíveis lidos do PostgreSQL, sem aplicar a estratégia pedida.
- **Somente leitura**, o serviço não escreve no Neo4j nem no PostgreSQL. O grafo é construído pelo
  `database-bootstrap`, e o contrato entre os dois está documentado na spec do projeto.
- **Saúde sem reinício em cascata**, `/health/live` não depende de nada e `/health/ready` só falha
  quando o PostgreSQL cai; o grafo aparece como `ready`, `unavailable`, `no_snapshot` ou `disabled`.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-recommendation/blob/main/docs/ARCHITECTURE.md)
- [RUNNING.md](https://github.com/Solierrr/api-recommendation/blob/main/docs/RUNNING.md)

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
