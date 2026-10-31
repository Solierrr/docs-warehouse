<p align="center">
  <img src="../assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

# Execução local

O CI usa Python 3.14 e PostgreSQL 16. Use também `make`, Docker, clientes `psql` e `pg_dump`. O backup usa PowerShell. Instale as dependências com `make install` e obtenha configuração com `make vault`, que exporta `/database`.

O procedimento comum de Python está em [PYTHON.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md). A stack local exige os repositórios `api-core`, `api-auth` e `mocks-warehouse` nas posições esperadas por `scripts/dev-stack.sh`.

| Comando | Efeito |
|---|---|
| `make dev-up` | Inicia bancos e APIs e carrega seed |
| `make dev-db` | Inicia apenas bancos, com seed se o schema existir |
| `make dev-status` | Mostra a stack |
| `make dev-down` | Para a stack preservando o volume |
| `make seed-plan ARGS=--dry-run` | Confere plano sem gravar |
| `make roles-check` | Confere privilégios contra o contrato |
| `make test` | Unittest |
| `make lint` | Ruff nos scripts |
| `make build` | Compila scripts e seed |

Para testes com banco descartável, configure `SOLARIA_TEST_PG_DSN`. O teste de seed também precisa de `SOLARIA_TEST_CORE_BASELINE`. Não há contrato OpenAPI, pois a interface é de linha de comando.
