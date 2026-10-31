<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# Execução local

Use Python 3.12, conforme o Dockerfile, `make`, Infisical CLI autenticado e PostgreSQL com o schema de negócio. Neo4j é opcional para executar o fallback. O guia comum está em [PYTHON.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

Execute `make install`, `make vault` e `make dev`. As pastas exportadas são `/database`, `/recommendation` e `/service-keys`. O servidor escuta localmente na porta 8000.

| Comando | Efeito |
|---|---|
| `make test` | Pytest com cobertura |
| `make lint` | Ruff em aplicação e testes |
| `make build` | Compilação dos módulos |
| `make openapi` | Exportação do contrato |

A coleção Bruno em `http/` contém os três feeds privados, públicos e health. Teste primeiro `/ready`. Sem Neo4j configurado, os feeds usam PostgreSQL. Sem chave de serviço válida, as rotas privadas recusam a chamada.
