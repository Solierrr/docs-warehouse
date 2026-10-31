<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# API

O [openapi.yaml](https://github.com/Solierrr/api-recommendation/blob/main/openapi.yaml) é o contrato completo. `/docs` e `/openapi.json` dependem de `DOCS_ENABLED`.

As rotas `/feeds/professionals`, `/feeds/offers` e `/feeds/suppliers` exigem `X-Service-Key` do `mcp-database`. O cabeçalho legado `X-Recommendation-Key` continua aceito quando configurado. As rotas `/public/feeds/*` são públicas e nunca consultam Neo4j.

```http
GET /feeds/offers?strategy=best_value
X-Service-Key: <chave do chamador>
```

O retorno privado inclui `source`, contexto, itens e avisos. `source=fallback` significa que a estratégia não foi aplicada. As listas públicas retornam cache público com `stale-if-error`.

Os erros usam o [catálogo](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERROR_CODES.md). Destacam-se `LOCAL_UNIT_REQUIRED`, `LOCAL_UNIT_NOT_FOUND`, `LOCAL_UNIT_GEO_REQUIRED`, `LOCAL_UNIT_GEO_AMBIGUOUS`, `PROFESSION_NOT_FOUND`, `CANDIDATE_POOL_TOO_LARGE` e `FEED_UNAVAILABLE`.
