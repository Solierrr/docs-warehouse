<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Execução local

Use Python, `make`, MongoDB, acesso aos modelos e aos serviços integrados. O Dockerfile usa `python:latest` e não fixa uma versão. O guia comum está em [PYTHON.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

Execute `make install`, `make vault` e `make dev`. O vault exporta `/database`, `/redis`, `/llm`, `/agent-queue` e `/service-keys`. O servidor usa `src.api.app:app`.

| Comando | Efeito |
|---|---|
| `make test` | Pytest com cobertura |
| `make lint` | Ruff nos módulos selecionados |
| `make build` | Compilação dos módulos |
| `make openapi` | Exportação do contrato |
| `python -m src.rag.indexing.ingest_faq` | Reconstrói explicitamente o índice do FAQ |

Abra `/docs` e teste `/ready` antes de `/chat`. O JWT deve vir do `api-auth`. Sem JWKS configurado fora de `LOCAL`, o acesso é recusado. O índice do FAQ não é criado durante uma requisição. Sua ausência produz informação de indisponibilidade no especialista.
