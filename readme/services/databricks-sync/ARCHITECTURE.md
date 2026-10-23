<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Arquitetura do Repositório

`POST /sync` lê somente CoreDB e recria as tabelas em
`workspace.bronze_core`. O `authdb` foi removido da lista de fontes Bronze.
As pipelines Silver e Gold ficam no `databricks-stocker`.

```text
CoreDB -> databricks-sync /sync -> workspace.bronze_core
                                -> Silver -> Gold (databricks-stocker)
                                            -> Databricks Job task
                                            -> databricks-sync /sync/gold
                                            -> analyticsdb.analytics_gold
```

O job de Databricks executa Silver, depois Gold e, após sucesso das duas,
chama `POST /sync/gold`. O endpoint usa a mesma verificação de Bearer token e
a mesma trava local que o Bronze. O manifesto fixa as views que podem ser
exportadas. O destino PostgreSQL usa uma transação para substituir as tabelas
de KPI e Row Level Security para isolar os consumidores.

Veja [GOLD.md](https://github.com/Solierrr/databricks-sync/blob/main/docs/GOLD.md) para o contrato, a preparação do banco e as limitações.
