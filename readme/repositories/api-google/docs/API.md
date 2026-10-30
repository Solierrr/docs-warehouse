<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# API

## Autenticação e contrato

`/v1/address` e `/v1/geo` exigem `Authorization: Bearer <token>` com JWT do `api-auth`. `/internal/i18n/translate` e `/internal/solar/roof-viability` exigem `X-Service-Key` do chamador permitido. Saúde e prontidão são públicas. O [contrato exportado](https://github.com/Solierrr/api-google/blob/main/openapi.yaml) inclui as rotas internas. O [Swagger em QA](https://google-registry.onrender.com/docs) e o `/openapi.json` servido exibem apenas rotas públicas quando a documentação está ligada.

## Operações

| Grupo | Finalidade |
|---|---|
| Endereços | Sugestão, detalhe, geocodificação, validação e resolução. |
| Geografia | Fuso e deslocamento UTC de uma coordenada. |
| Tradução | Detecção do idioma e tradução de campos. |
| Energia solar | Dados solares do telhado mais próximo. |
| Saúde | Estado do processo e prontidão. |

As rotas antigas `/v1/i18n/translate` e `/v1/solar/roof-viability` permanecem abertas e fora do contrato. <!-- PENDENTE: 1 -->

## Erros

Erros de entrada e de dependência usam `application/problem+json` com `errorCode`. Chave inválida retorna `UNAUTHENTICATED`. Chamador não permitido retorna `FORBIDDEN`. Uma rejeição do provedor pode retornar `UPSTREAM_REQUEST_REJECTED`. Falhas externas podem gerar 502, 503 ou 504. Consulte o [catálogo de erros](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERROR_CODES.md). O `/ready` usa JSON simples.

## Exemplo local

```bash
curl -H "Authorization: Bearer <token>" "http://localhost:8000/v1/geo/timezone?latitude=-23.55&longitude=-46.63"
```
