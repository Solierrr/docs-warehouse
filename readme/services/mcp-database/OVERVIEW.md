<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/claude.png" alt="Claude" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# O que o serviço entrega

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
