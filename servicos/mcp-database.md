<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/claude.png" alt="Claude" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Consulta de dados para IA

[![License](https://img.shields.io/github/license/Solierrr/mcp-database)](https://github.com/Solierrr/mcp-database/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/mcp-database)](https://github.com/Solierrr/mcp-database/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/mcp-database)](https://github.com/Solierrr/mcp-database/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/mcp-database)](https://github.com/Solierrr/mcp-database/releases)

Este serviço dá aos assistentes de inteligência artificial da plataforma acesso seguro a informações de negócio, como ofertas de placas solares, profissionais e fornecedores. Em vez de consultar o banco de dados diretamente, o assistente usa consultas prontas oferecidas por este serviço, que só lê as informações, nunca as altera, e exige uma chave de acesso. Isso protege o banco e dá aos assistentes uma forma padronizada de buscar o que precisam. As consultas disponíveis e as instruções de uso estão nas seções abaixo.

## Detalhes técnicos

Servidor MCP que expõe consultas ao Postgres de negócio da plataforma para o
`ai-assistant`, por meio do Model Context Protocol autenticado por API key.
Este repositório é somente de leitura e não é dono do schema; a fonte do
schema é o `database-console` (`db/core/schema.sql` e as migrations em `db/core/migrations`).
O acesso ao banco deve usar o usuário somente leitura `solaria_ro_mcp` (contrato em
`db/roles/contracts.json` do `database-console`).

## O que ele entrega

O SDK `mcp`, servido por Starlette/Uvicorn, descobre funções Python decoradas
com `@mcp.tool()`. Assim, agentes consultam capacidades conhecidas em vez de
depender de endpoints REST customizados. O acesso ao PostgreSQL é isolado em
`postgres_client.py` e o endpoint `/mcp` exige API key.

Ferramentas disponíveis:

- `recomendar_ofertas(estrategia, unidade_id, limite)` — top-N de ofertas de
  placas ranqueado pela `api-recommendation` (`best_value`, `most_efficient`,
  `nearest_available`, `most_proven`).
- `recomendar_profissionais(estrategia, profissao_id, limite)` — top-N de
  profissionais (`best_match`, `top_rated`, `most_qualified`,
  `most_experienced`, `most_reliable`).
- `recomendar_fornecedores(estrategia, unidade_id, limite)` — top-N de empresas
  fornecedoras (`most_proven`, `broadest_catalog`, `nearest`).
- `listar_itens_de_fixacao(tipo, marca, limite)` — ofertas de itens de fixação (trilho,
  grampo, suporte, gancho, kit) por preço, sem ranking por mérito (consulta direta ao Postgres).
- `listar_profissoes()` — profissões e ids, para filtrar os profissionais.
- `buscar_tecnicos_credenciados(profissao, cidade)` — técnicos afiliados a
  empresas e seus registros profissionais (consulta direta ao Postgres).

As ferramentas `recomendar_*` não calculam ranking: chamam os feeds da
`api-recommendation` (`RECOMMENDATION_API_URL`, `RECOMMENDATION_API_KEY`) e
devolvem `fonte`, `avisos` e `itens` com a métrica e os motivos de cada
posição. Se o serviço falhar, devolvem `{"erro": ...}` para o agente explicar.

## Rodando localmente

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `MCP_API_KEY`.
2. Instale dependências com `pip install -r requirements.txt`.
3. Inicie com `python server.py`.

Para usar o padrão organizacional de ambiente, prefira `make env ENV=local`
antes do start.

## Docker

```sh
docker build -t api-mcp .
docker run --env-file .env -p 8001:8001 api-mcp
```

## Testes

```sh
python -m pytest tests -v
```

Os testes usam mocks e não requerem PostgreSQL nem um `.env` real.

## Documentação e contribuição

- [Arquitetura](https://github.com/Solierrr/mcp-database/blob/main/docs/ARCHITECTURE.md)
- [Como executar](https://github.com/Solierrr/mcp-database/blob/main/docs/RUNNING.md)
- [Guia de contribuição](https://github.com/Solierrr/mcp-database/blob/main/.github/CONTRIBUTING.md)
- [CODEOWNERS](https://github.com/Solierrr/mcp-database/blob/main/.github/CODEOWNERS)
