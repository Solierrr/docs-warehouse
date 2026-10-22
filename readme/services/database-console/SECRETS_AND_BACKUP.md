<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Segredos e backup PostgreSQL

### Migrations do core

`make migrate TARGET=core` executa todas as migrations em ordem usando `scripts/migrate.py`, com as variáveis `DB_POSTGRES_*` já usadas pelo exportador. Cada migration e seu registro em `solaria_schema_history` são gravados na mesma transação. O runner confere checksums e serializa execuções concorrentes. Não alterar migrations já aplicadas.

Para um banco existente sem histórico, primeiro conferir sua estrutura contra as versões e executar o diagnóstico `db/core/diagnostics.sql` depois da V12. Somente após confirmar o baseline, usar `make migrate TARGET=core BASELINE=11` se ele já corresponder às V1–V11. Baseline registra versões como já presentes; não executa nem verifica automaticamente seus SQLs. Bancos divergentes precisam ser reconciliados antes, sem descartar dados.

Instalações novas devem preferir o runner desde a V1. `schema.sql` permanece como alternativa de instalação vazia, incluindo as estruturas novas; não executar sobre um banco já instalado nem executar V1 novamente após esse caminho. Os scripts antigos `api-core/src/main/resources/db/deeplink.sql` e `api-core/database/schema-user-connections.sql` foram substituídos por avisos: a fonte executável agora fica aqui. Seeds são apenas para desenvolvimento.

As migrations V12–V18 cobrem validação/documentos privados, integridade de estoque/ofertas, fila de tradução, estados/histórico de ofertas, equipes, índices e permissões. Duplicidades e valores inválidos interrompem a migration; não há saneamento automático. Novas permissões entram no catálogo e precisam ser atribuídas aos cargos apropriados.

Para testar em um PostgreSQL isolado, definir `SOLARIA_TEST_PG_DSN` e executar `python -m unittest discover -s tests -v`. Os testes usam schemas temporários próprios e removem somente esses schemas no encerramento.

Extraia as credenciais do ambiente desejado com `make vault ENV=qa` (`local`, `qa` ou `prod`; o padrão é `local`). Ele grava o `.env` a partir do Infisical (pasta `/database`) e exige o Infisical CLI com `infisical login`. O arquivo `.env` é local e ignorado pelo Git. `make help` lista os demais comandos.

`make backup` pergunta qual banco PostgreSQL salvar: `core`, `auth` ou ambos. Para executar sem menu, use `make backup TARGET=core`, `make backup TARGET=auth` ou `make backup TARGET=all`. O comando usa `DB_POSTGRES_*` do `.env` e grava arquivos SQL com data e hora em `backups/<ambiente>/`, diretório ignorado pelo Git. Para mudar o ambiente do backup, extraia primeiro o `.env` correspondente. O banco MongoDB de `messenger` não é incluído em `pg_dump`.

Os dumps podem conter dados sensíveis. Mantenha os arquivos fora do Git e compartilhe apenas por um canal aprovado pela equipe.
