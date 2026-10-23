<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Carga do banco de recomendações

[![License](https://img.shields.io/github/license/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/database-bootstrap)](https://github.com/Solierrr/database-bootstrap/releases)

Esta rotina monta e reconstrói o banco de relações usado nas recomendações da plataforma a partir dos dados do banco principal. Ela não permanece em execução: roda sob demanda, conclui o trabalho e termina. Como o banco principal é a fonte oficial das informações, o banco de relações pode ser apagado e recriado a qualquer momento, e esta rotina o preenche novamente com os dados atuais.

## Ficha técnica

- **Tipo:** rotina executada sob demanda.
- **Stack:** Python 3.12.
- **Dados:** lê o PostgreSQL e grava o Neo4j.
- **Integrações:** nenhuma API da aplicação.
- **Ambientes:** Job no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/ARCHITECTURE.md), arquitetura do serviço.
- [RUNNING.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/RUNNING.md), como rodar localmente.
- [HOW_IT_WORKS.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/HOW_IT_WORKS.md), funcionamento da rotina e códigos de saída.
- [CONFIGURATION.md](https://github.com/Solierrr/database-bootstrap/blob/main/docs/CONFIGURATION.md), variáveis de configuração e árvore do repositório.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
