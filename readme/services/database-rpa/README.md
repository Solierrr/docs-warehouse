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

Esta rotina migra usuários e dados de um banco de dados antigo para o banco principal da plataforma. Ela lê o banco antigo sem alterá-lo, converte as informações para o formato novo e completa com dados fictícios os campos que o banco antigo não possuía. A execução pode ser repetida sem duplicar registros e pode rodar todos os dias de forma automática, depois que as conexões forem configuradas. O uso contra um banco real exige revisão prévia dos dados.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/database-rpa/blob/main/docs/ARCHITECTURE.md), arquitetura do repositório e estrutura de pastas.
- [STATUS.md](https://github.com/Solierrr/database-rpa/blob/main/docs/STATUS.md), o que é migrado, limites conhecidos e arquivos.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
