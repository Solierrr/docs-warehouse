<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Feeds e comportamento

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
