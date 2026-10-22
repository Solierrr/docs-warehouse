<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Migração de dados legados

[![License](https://img.shields.io/github/license/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/database-rpa)](https://github.com/Solierrr/database-rpa/releases)

Esta rotina trouxe usuários e dados de um banco de dados antigo para o banco principal da plataforma. Ela lê o banco antigo sem alterá-lo, ajusta as informações para o formato novo e preenche com dados fictícios o que o banco antigo não tinha. Ela pode ser repetida sem duplicar registros. Por enquanto não há publicação conhecida em nenhum ambiente, e só deve ser usada contra um banco real depois de revisar os dados. Os detalhes do que é migrado e dos limites conhecidos estão nas seções abaixo.

## Detalhes técnicos

ETL em Python que migrou usuários e dados de um banco legado ("banco simples", tabela `usuario`) para o `coredb` da plataforma. Lê a origem (`ORIGEM_DB_URL`, somente leitura), transforma e **grava direto no `coredb`** (`DESTINO_DB_URL`), controlando a idempotência na tabela `rpa_id_mapping` do destino.

## Status: adaptado ao schema V29 do `coredb`

- **Origem:** o banco legado dos serviços Elos, que não faz parte do escopo da plataforma e **não deve ser alterado** (a conexão é somente leitura).
- **Destino:** o `coredb`. O que o legado não traz é preenchido com dados fictícios determinísticos (Faker, em `mock_data.py`).
- **O que o ETL respeita no V29** (regras em `schema_v29.py`): `users.auth_id` e `users.username` (`^[a-z0-9_]{3,30}$`, único, derivado do e-mail), `company.type` (`SUPPLIER` ou `DEMANDANT`) e `slug` único, `technician.slug` e `offer.slug` únicos, marca do modelo em `brand` (`legacy = true`), largura e comprimento do modelo em metros, tipo `MONOCRYSTALLINE`, preço da oferta maior que zero, vínculo do dono da empresa com o cargo `ADMIN` e um único vínculo por usuário.
- **Imagens:** com `CLOUDINARY_CLOUD_NAME` definido, usuários, empresas e modelos migrados recebem fotos do `mocks-warehouse` (`user_photo`, `company_photo` e `model_photo`, as mesmas categorias do seed do `database-console`); `MOCKS_MANIFEST` aponta o `manifest.json` (padrão `../mocks-warehouse/manifest.json`) e `MOCKS_PUBLIC_PREFIX` o prefixo (padrão `mocks`). Sem a cloud ou o manifest, o passo é pulado com um aviso. Só entram registros que ainda não têm foto.
- **Limites conhecidos:** `users.auth_id` é um id sem conta no authdb, porque o ETL não escreve no authdb; os usuários migrados só entram depois que uma conta com esse id for criada (a senha do legado não é reaproveitada). Os projetos técnicos só migram se o legado tiver `projeto` e `usuario_projeto`.
- Foi verificado contra um `coredb` novo (migrações V1 a V29) e um legado de teste, incluindo uma segunda execução sem duplicar nada. Não há implantação conhecida (não está no Render nem no `infra-gitops`); não execute contra um banco real sem antes revisar os dados.

## Arquivos

| Arquivo | Papel |
|---|---|
| `main.py` | Orquestra a execução e registra em `rpa_etl.log` |
| `extract.py`, `transform.py`, `load.py` | Extrai os usuários novos da origem, transforma e grava `users`, `contact` e `person` no destino |
| `extended_migration.py` | Migração complementar (empresas, endereços, ofertas, estoque e outras tabelas) |
| `mock_data.py`, `inspecionar.py` | Dados fictícios com Faker e inspeção do banco |

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
