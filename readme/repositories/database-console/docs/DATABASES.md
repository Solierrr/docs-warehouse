<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Bancos de dados

## Detalhes técnicos

Repositório responsável por guardar, documentar e facilitar o uso de scripts, planejamentos e mudanças nos bancos de dados do projeto. É utilizado `Makefile` para facilitar a execução de scripts `SQL`. Todas as declarações de Triggers, Procedures, Functions, Indexes, Metadados (como Enums), entre outros; são guardados aqui nesse repositório de maneira organizada e granularizada. Além de toda organização para `SQL`, também há a presença de `python` para a execução de dataloads massivos com uso de Faker e dados pré-definidos.

## Banco de analytics

Use `make create TARGET=analytics ENVIRONMENT=prod` para criar o banco PostgreSQL `analyticsdb` sem apagar um banco existente. Depois, `make schema TARGET=analytics ENVIRONMENT=prod` cria o schema de destino e o controle de acesso. Com `ENVIRONMENT=qa`, o nome segue a convenção do repositório e passa a ser `analyticsdbqa`. O `databricks-sync` exporta para esse banco as views Gold já calculadas pelo `databricks-stocker`, conforme [contrato de destino analytics](https://github.com/Solierrr/database-console/blob/main/db/analytics/README.md). Para abrir uma sessão, use `make connect TARGET=analytics ENVIRONMENT=prod`. Nenhum desses comandos é executado automaticamente.

## Consumir o coredb localmente

`make dev-db` sobe só o Postgres e o Redis em Docker, aplica as migrações de `core` e `auth` (inclusive o carrinho e os pedidos, V27 e V28), carrega o seed planejado e imprime como conectar: `postgresql://solaria:solaria@localhost:55432/coredb` (porta ajustável por `SOLARIA_PG_PORT`). Serve para apontar uma API ou um cliente SQL para o banco sem subir `api-auth` e `api-core`. `make dev-up` faz o mesmo e ainda sobe as duas APIs; `make dev-status` mostra o que está de pé; `make dev-down` para tudo e mantém os dados no volume.

Os containers se chamam `local-database-console-postgres` e `local-database-console-redis`. Quem já tinha os containers antigos (`solaria-postgres` e `solaria-redis`, parados) pode removê-los com `docker rm solaria-postgres solaria-redis`: os dados ficam no volume `solaria-pgdata`, que o compose continua usando.

## Carrinho e pedidos

As migrações `V27__marketplace_orders.sql` e `V28__purchase_permissions.sql` criam as tabelas `cart`, `cart_item`, `purchase_order`, `order_item` e `order_payment` e as permissões de compra no catálogo (`permission`). O pedido guarda uma cópia do preço, do desconto e do nome do modelo; o pagamento é fictício. Duas regras valem também no banco, por gatilho: usuário de empresa fornecedora só compra se for profissional registrado e aprovado, e ninguém compra de uma empresa fornecedora a que pertence. A spec está no VersioSpec (`marketplace/pagamentos`). Os testes são `tests/test_marketplace_migration.py`.

## Acesso de leitura ao coredb por consumidor

Quem lê o `coredb` direto (fora o `api-core`) usa um usuário somente leitura, um por consumidor, com o menor privilégio possível. O contrato de cada um (tabelas e colunas que ele lê) está em [`db/roles/contracts.json`](https://github.com/Solierrr/database-console/blob/main/db/roles/contracts.json) e é aplicado por [`scripts/roles.py`](https://github.com/Solierrr/database-console/blob/main/scripts/roles.py): `api-recommendation`, `database-bootstrap`, `mcp-database` e `databricks-sync` (este último é uma proposta que depende de confirmar o que o pipeline precisa). O `database-rpa` não tem papel: a decisão é aposentá-lo (ver a spec de acesso ao `coredb` no VersioSpec).

```bash
make roles-apply                 # cria os papéis solaria_ro_* (sem login) e concede só SELECT, conforme o contrato
make roles-check                 # confere o banco com o contrato; sai com 1 se divergir (permissão a mais ou a menos)
python scripts/roles.py login api-recommendation svc_recommendation SENHA_RECOMENDACAO
                                 # cria o login do consumidor; a senha vem da variável de ambiente, nunca de arquivo
```

Os papéis não herdam tabelas novas: depois de uma migration que cria tabela ou coluna que um consumidor passa a ler, atualize o contrato e rode `make roles-apply` (o `roles-check` acusa a diferença). Em QA e produção quem cria os logins e guarda as senhas no Infisical é o dono; o script nunca imprime nem grava senha.

## De quem é o schema

- **`coredb`:** a fonte única é este repositório (`db/core/schema.sql` para instalação vazia e `db/core/migrations` para evoluir). O `api-core` não tem migrações próprias e roda com `ddl-auto=validate`, só conferindo o banco contra as entidades. Não existem outras cópias do DDL: o `schema-user-connections.sql` do `api-core` e o `schema_negocio.sql` do `mcp-database` foram removidos.
- **`authdb`:** o autor das migrations é o `api-auth` (`src/main/resources/db/migration`, Flyway). Os arquivos de `db/auth/migrations` daqui são um **espelho** dos dele: nos ambientes quem os executa é `scripts/migrate.py --target auth`, com o Flyway do `api-auth` desligado (`SPRING_FLYWAY_ENABLED=false`); ligar os dois no mesmo banco faria o Flyway tentar recriar o que o `migrate.py` já criou. Uma migration nova nasce no `api-auth` e é copiada para cá; `make auth-mirror-check` (`API_AUTH_DIR` aponta para o clone do `api-auth`, padrão `../api-auth`) acusa arquivo que falta, que sobra ou que difere, ignorando só os comentários do começo.

Para carregar dados no Databricks, use `make export-parquet TARGET=core` (ou `TARGET=auth` / `TARGET=all`). Sem `TARGET`, o comando pergunta qual banco exportar. Instale as dependências com `python -m pip install -r scripts/requirements.txt`. O exportador transmite as tabelas em lotes e cria uma pasta Parquet por tabela, com compressão Snappy, além de um `manifest.json`, em `exports/<ambiente>/<banco>/<data-hora-UTC>/`. Copie essa pasta para o armazenamento acessível ao Databricks; cada tabela pode ser lida separadamente, por exemplo `spark.read.parquet("<caminho>/public__company")`. Tipos UUID e enums viram texto; JSON e arrays viram texto JSON; números, datas, timestamps, booleanos e binários mantêm tipos Parquet compatíveis.
