<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Migração de dados legados

[![License](https://img.shields.io/github/license/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/releases)

Esta rotina trouxe usuários e dados de um banco de dados antigo para o banco principal da plataforma. Ela lê o banco antigo sem alterá-lo, ajusta as informações para o formato novo e preenche com dados fictícios o que o banco antigo não tinha. Ela pode ser repetida sem duplicar registros. Por enquanto não há publicação conhecida em nenhum ambiente, e só deve ser usada contra um banco real depois de revisar os dados. Os detalhes do que é migrado e dos limites conhecidos estão nos documentos da seção Aprofunde-se.

## Aprofunde-se no Projeto!

- [STATUS.md](https://github.com/Solierrr/database-rpa/blob/main/docs/STATUS.md), o que é migrado, limites conhecidos e arquivos.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
