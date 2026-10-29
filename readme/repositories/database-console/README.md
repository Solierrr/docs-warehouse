<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Console dos bancos de dados

[![License](https://img.shields.io/github/license/Solierrr/database-console)](https://github.com/Solierrr/database-console/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/database-console)](https://github.com/Solierrr/database-console/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/database-console)](https://github.com/Solierrr/database-console/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/database-console)](https://github.com/Solierrr/database-console/releases)

Este repositório reúne o necessário para criar, atualizar e consultar os bancos de dados da plataforma: os scripts que montam as tabelas e as regras, as mudanças de versão e os dados de exemplo usados em desenvolvimento. Ele permite subir uma cópia local dos bancos para testar outros serviços sem depender de ambientes compartilhados e registra a responsabilidade por cada parte do banco e as permissões de leitura de cada serviço.

## Aprofunde-se no Projeto!

- ARCHITECTURE.md {a confirmar: ainda não existe neste repositório}, documento de arquitetura dos bancos.
- RUNNING.md {a confirmar: ainda não existe neste repositório}, como rodar os bancos localmente (veja os comandos nas seções acima).
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), como o deploy funciona na organização.
- [DATABASES.md](https://github.com/Solierrr/database-console/blob/main/docs/DATABASES.md), bancos, dono de cada schema e acesso de leitura por consumidor.
- [SECRETS_AND_BACKUP.md](https://github.com/Solierrr/database-console/blob/main/docs/SECRETS_AND_BACKUP.md), segredos e backup do PostgreSQL.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.

### Projetos privados (V24)

V24 inclui propriedade empresarial/profissional, participação, convites, agenda, histórico e fotos privadas. Preserva empresa/local/executores dos projetos antigos e disponibiliza seus serviços na agenda, mantendo término desconhecido vazio. Status de projetos/serviços e tipo de afiliação ficam em varchar com constraints, alinhados ao JPA. Afiliação independente pode ter empresa nula; nenhuma relação de emprego é criada.

Banco existente: aplicar V24 após V23. Banco novo: schema consolidado já inclui V24; baseline deve ser 24 antes de usar o executor. Testes específicos: `python -m unittest discover -s tests -p test_projects_migration.py -v` com SOLARIA_TEST_PG_DSN apontando para um PostgreSQL descartável.
