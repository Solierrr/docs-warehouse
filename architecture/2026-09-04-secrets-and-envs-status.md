# Status: Centralização de Secrets (Infisical) + Envs — 2026-09-04

Documento de handoff — pra continuar isso de qualquer máquina/sessão, sem
precisar reconstruir contexto do zero. Ver o design completo em
[`2026-09-03-secrets-and-envs-design.md`](2026-09-03-secrets-and-envs-design.md)
e o plano em [`2026-09-03-secrets-and-envs-plan.md`](2026-09-03-secrets-and-envs-plan.md)
— este arquivo é só o "onde paramos".

## Fatos-chave

- **Projeto Infisical**: workspace ID `2296d19c-5f3b-41e1-afa3-fcde39966a71`, org "Solaria".
- **Slugs dos environments**: `local`, `qa`, `prod` (**não** `dev` — isso foi
  assumido errado no início e corrigido em todo lugar).
- **CLI do Infisical**: no Windows/Git Bash, sempre rodar com
  `export MSYS_NO_PATHCONV=1` antes (senão `--path=/algo` vira um caminho de
  arquivo do Windows). Comando de secret: `infisical secrets set "KEY=valor"
  --env=<local|qa|prod> --path=/<pasta> --projectId 2296d19c-5f3b-41e1-afa3-fcde39966a71`.
  `infisical export` **não tem `--recursive`** (só `infisical run` tem) — pra
  gerar `.env` de verdade localmente, roda um `export` por pasta e concatena.
- **Render**: projeto "Solaria", ambiente "QA" (workspace `Solaria Network's
  workspace`, project ID `prj-da701515efls7387etu0` — environment ID
  `evm-da701515efls7387etu0`). CLI: `render` não tem comando pra atualizar env
  var de serviço existente, só na criação (`services create --env-var`).

## 15 pastas do Infisical (todas criadas nos 3 ambientes)

Nomeadas pelo que representam, não pelo serviço que consome (pedido
explícito do usuário — evitar acoplar nome de pasta a "quem usa hoje"):

`auth`, `database`, `google`, `redis`, `vite`, `cloudinary`, `llm`, `otel`,
`databricks`, `service-urls`, `recommendation`, `mcp`, `agent-queue`,
`outbox`, `shared`. Catálogo completo (quem usa o quê) na seção 1 do design
doc.

## O que JÁ está populado no Infisical (nos 3 ambientes)

- `/auth`: segredos gerados (`JWT_SECRET`, `SERVICE_JWT_SECRET`,
  `SERVICE_CLIENT_SECRET`) + **keystore JWT novo gerado do zero** (o antigo
  foi perdido) — `JWT_KEYSTORE_BASE64`/`JWT_KEYSTORE_PASSWORD`/`JWT_ACTIVE_KID=auth-2026-09`
  diferentes por ambiente, mais `JWT_ISSUER`, `JWT_ACCESS_TOKEN_TTL`,
  `JWT_REFRESH_TOKEN_TTL`, `JWT_KEYSTORE_PATH`, `FIREBASE_ENABLED=false`.
- `/mcp`: `MCP_API_KEY` gerado, `PORT=8001`.
- `/recommendation`: `API_KEY`/`SYNC_API_KEY`/`RECOMMENDATION_API_KEY`
  gerados (distintos entre si), tuning (`SYNC_*`, `SNAPSHOT_*`,
  `RECOMMENDATION_*`), `APP_ENVIRONMENT` (development/test/production por
  ambiente), `APP_TIMEZONE`, `DOCS_ENABLED` (true/true/false).
- `/agent-queue`: todo o tuning `AGENT_*` (mesmo valor nos 3 ambientes).
- `/outbox`: todo o tuning `OUTBOX_*` (mesmo valor nos 3 ambientes).
- `/otel`: endpoint/sampling/versão/ambiente por ambiente.
- `/vite`: `VITE_APP_MODE`/`VITE_MOCKS`/`VITE_LOGS` por ambiente,
  `VITE_EXCHANGE_API` fixo.
- `/databricks`: só `DATABRICKS_CATALOG`/`SCHEMA_CORE`/`SCHEMA_AUTH` (não
  credencial).
- `/cloudinary`: só `CLOUDINARY_FOLDER_PREFIX=solier`.
- `/llm`: só `LLM_MODEL`/`LLM_TEMPERATURE`.
- `/service-urls`: **valores reais** por ambiente (local=`localhost:porta`,
  prod=DNS interno do cluster / `sslip.io` via Kong, qa=URLs reais do
  Render abaixo).

## O que FALTA popular (só o usuário tem)

Mandei um arquivo `envs.fillable.env` pro usuário preencher (fora do git,
via download) com:
- `/database`: credenciais reais de Postgres/Mongo/Neo4j (host/user/senha)
  nos 3 ambientes + **confirmar os nomes reais dos bancos** (código usa
  `dbsolier`/`authdb` como default, mas o usuário exemplificou
  `coredb`/`authdb` ao definir o padrão — inconsistência não resolvida).
- `/redis`: credenciais reais das 2 instâncias Upstash (`AGENTS`/`CORE`).
- `/cloudinary`, `/google`, `/llm`: chaves de API reais de terceiros.
- `/databricks`: `DATABRICKS_HOST`/`HTTP_PATH`/`TOKEN`.

**Quando o usuário devolver esse arquivo preenchido, aplicar via
`infisical secrets set` (comando acima) pasta por pasta, ambiente por
ambiente.**

## Serviços no Render (QA) — todos já existem

| Serviço | Runtime | URL |
|---|---|---|
| web-app | static_site | https://web-app-ldi0.onrender.com |
| ai-assistant | python nativo (Dockerfile existe mas não é usado no Render; start command corrigido pra `uvicorn src.api.app:app`) | https://ai-assistant-5ljd.onrender.com |
| ai-validation | docker | https://ai-validation-jjb7.onrender.com |
| api-auth | docker | https://api-auth-xw6o.onrender.com |
| api-core | docker | https://api-core-cqfn.onrender.com |
| api-messenger | docker | https://api-messenger-5g2n.onrender.com |
| api-recommendation | docker | https://api-recommendation-qlml.onrender.com |
| api-mcp | python nativo (repo sem Dockerfile) | https://api-mcp-wey6.onrender.com |

Integração nativa Infisical↔Render: usuário escolheu ativar (opção 1, sem
`infisical run`/CLI dentro do container). Mapeamento pasta→serviço
recomendado está na seção "Render QA" do design doc — **não confirmado se
já foi todo configurado no dashboard**.

Machine Identity `render` foi criada pelo usuário mas **não é usada** nessa
abordagem (a integração nativa não usa Client ID/Secret) — fica sem uso, o
usuário já rotacionou o secret dela por segurança (tinha sido colado em
texto no chat).

## Machine Identities do Infisical

- `gke-sync`: **criada** pelo usuário. Falta dar acesso dela no projeto
  (Role Viewer, só env `prod`) se ainda não fez.
- `ci-shared`: **decidido não criar ainda** — nenhum workflow de CI hoje
  precisa ler secret do Infisical (só faz sentido a partir da Fase 5/6,
  quando existir automação de release/CI que precise disso).
- `render`: criada, sem uso (ver acima).

## PRs mergeadas nesta sessão (todas com `--admin` bypass, a pedido do usuário)

Repos tocados: `api-core`, `api-auth`, `api-messenger`, `api-recommendation`,
`ai-assistant`, `api-mcp`/`api-database-mcp`, `infra-platform`,
`infra-gitops`, `docs-warehouse`. Mudanças principais:
- Renomeação de env vars pro padrão Infisical (`DB_POSTGRES_*`,
  `UPSTASH_*_*`, `DB_MONGO_*`) em todos os serviços.
- `infra-platform/secrets.tf`: provider Infisical + `data
  "infisical_secrets"` por pasta + `kubernetes_secret` por serviço
  (`api-core`, `api-auth`, `api-messenger`, `api-recommendation`, `api-mcp`,
  `ai-assistant`, `ai-validation`). `web-app` propositalmente sem secret
  (SPA estática, `VITE_*` são build-time).
- `infra-gitops`: `envFrom`/`secretRef` ligado nos `Deployment` que
  faltavam, `api-mcp` ganhou `Deployment`/`Service`/`Application` do zero
  (não existia), bug real corrigido (`CORE_BASE_URL`→`PERSISTENCE_BASE_URL`
  no `api-auth`).
- `api-auth` ganhou Swagger/OpenAPI (era o único serviço REST sem).
- Templates: `docs-warehouse/templates/infisical/infisical.env.example.{local,qa,prod}`
  (catálogo mestre, valores vazios) e `docs-warehouse/templates/readme/`
  (o usuário construiu um sistema de templates de README bem mais completo
  que o meu direto em `main`, com `ARCHITECTURE.template.md`,
  `running/<stack>/RUNNING.md` por stack — meu template simples foi
  substituído por esse).

## Pendências gerais (fora do escopo de secrets)

Do plano original (fases 4-6, não iniciadas):
- Fase 4: guia de uso das CLIs (Infisical/Render/GCP) — parcialmente coberto
  por este doc + os READMEs de cada repo.
- Fase 5: release semântico automático (`release.yml` hoje só builda/publica
  Docker com tag `latest`+`sha`, sem semver).
- Fase 6: padronizar `qa-sync.yml` nos repos que faltam + workflow de aviso
  em PR direto pra `main`.

Itens específicos ainda em aberto: classificação de alguns repos
(`ai-billscanner`, `database-rpa`, `databricks-analytics`,
`database-console`, `google-registry`, `mobile-app`,
`infra-otel-collector`), ferramenta de release semântico a escolher
(`release-please` vs `semantic-release`), `mobile-app` (Flutter) provavelmente
fora do padrão Infisical (build flavors).
