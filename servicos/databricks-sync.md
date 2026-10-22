<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Sincronização com o Databricks

[![License](https://img.shields.io/github/license/Solierrr/databricks-sync)](https://github.com/Solierrr/databricks-sync/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/databricks-sync)](https://github.com/Solierrr/databricks-sync/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/databricks-sync)](https://github.com/Solierrr/databricks-sync/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/databricks-sync)](https://github.com/Solierrr/databricks-sync/releases)

Este serviço leva os dados da plataforma para a área de análise e traz de volta os indicadores já calculados. Quando acionado, ele copia os dados do banco principal para o ambiente de análise e, depois que os indicadores ficam prontos, exporta os resultados para o banco que alimenta os painéis. Só é acionado por quem tem a chave de acesso e não roda sozinho em horários fixos. O cálculo dos indicadores em si fica em outro repositório.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/databricks-sync/blob/main/docs/ARCHITECTURE.md), fluxo de sincronização.
- [RUNNING.md](https://github.com/Solierrr/databricks-sync/blob/main/docs/RUNNING.md), configuração da API local.
- [GOLD.md](https://github.com/Solierrr/databricks-sync/blob/main/docs/GOLD.md), views exportadas, contrato do AnalyticsDB e isolamento por principal.
- **Deployment**, este repositório não publica um serviço hospedado: a API é iniciada localmente pelo Makefile. O workflow [`sync.yml`](https://github.com/Solierrr/databricks-sync/blob/main/.github/workflows/sync.yml) mantém acionamento manual para Bronze; a exportação Gold é acionada pelo job do `databricks-stocker`.

## Contribuindo

- [.github/CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [.github/CODEOWNERS](https://github.com/Solierrr/databricks-sync/blob/main/.github/CODEOWNERS), donos responsáveis por aprovar mudanças em cada caminho do repositório.
- `CODE_OF_CONDUCT.md` e `SECURITY.md`, {a confirmar, não encontrados neste repositório no momento da escrita}.
