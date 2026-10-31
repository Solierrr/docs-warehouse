<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# API

O [openapi.yaml](https://github.com/Solierrr/ai-accessibility/blob/main/openapi.yaml) contém o contrato. `/docs` e `/openapi.json` dependem de `DOCS_ENABLED`. A rota `POST /v1/images/analyze` exige `X-Service-Key` de chamador aceito.

```http
POST /v1/images/analyze
X-Service-Key: <chave do chamador>
Content-Type: multipart/form-data
```

O formulário recebe `image`, `purpose` e, opcionalmente, `request_id`, `context_title` e `max_alt_chars`. O resultado inclui `decision`, motivos, categorias, texto alternativo e versões da política e dos modelos. `approved`, `review_required` e `rejected` são decisões de análise, não códigos HTTP.

Chave inválida produz 401, upload bruto acima do limite produz 413 e formulário inválido produz 422. Ausência de provedor produz 503. Erros seguem [ERRORS.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). Falha técnica do provedor pode resultar em revisão com `PROVIDER_UNAVAILABLE`.

`/debug/images/analyze` e `/debug/images/stage` são administrativos e ficam fora do Swagger. Usam JWT e permitem reexecutar moderação ou legenda a partir de uma execução temporária do mesmo administrador.
