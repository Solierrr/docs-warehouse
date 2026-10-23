<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Arquitetura do Repositório

O `database-console` concentra os schemas, as migrações, os papéis de acesso e a carga de exemplo dos bancos PostgreSQL da plataforma. Não é um serviço: é um conjunto de scripts SQL e Python acionados pelo `Makefile`, que funcionam tanto contra um banco local, em Docker, quanto contra os bancos dos ambientes. É a fonte única do schema do `coredb`; o do `authdb` pertence ao `api-auth` e é mantido aqui como espelho.

- **Schemas e migrações (`db/`):** uma pasta por banco (`core`, `auth`, `analytics` e `messenger`), com o schema para instalação vazia e as migrações versionadas para evolução.
- **Papéis de acesso (`db/roles/`):** cada consumidor que lê o `coredb` diretamente tem um papel somente leitura, com as tabelas e colunas descritas num contrato; um comando aplica e outro confere o banco contra o contrato.
- **Ambiente local (`docker-compose.yml` e `docker/`):** sobe PostgreSQL e Redis, aplica as migrações e carrega os dados de exemplo.
- **Carga de exemplo (`seed/`):** gera dados coerentes a partir de um plano declarativo, com imagens do `mocks-warehouse`.
- **Scripts (`scripts/`):** migração, backup, exportação em Parquet, verificação do espelho do `authdb` e aplicação dos papéis.
- **Testes (`tests/`):** validam as migrações, os papéis, o espelho e a carga de exemplo.

## Estrutura do repositório

```text
├── .github/
├── db/
│   ├── analytics/
│   ├── auth/
│   ├── core/
│   ├── messenger/
│   ├── roles/
│   ├── create.sql
│   └── reset.sql
├── docker/
├── docs/
├── scripts/
├── seed/
├── tests/
├── docker-compose.yml
├── Makefile
└── README.md
```
