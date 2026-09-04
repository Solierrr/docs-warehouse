# Design: Centralização de secrets (Infisical) e padronização de envs (Local / QA / Prod)

Status: rascunho — aguardando revisão do usuário.

## Contexto e problema

O cluster GCP (prod) é derrubado (`terraform destroy`) sempre que ninguém está
usando, e recriado (`terraform apply`) quando necessário, para economizar
custo enquanto o projeto está em fase de teste. Isso gera três ambientes de
execução por serviço, cada um com seu próprio jeito de injetar env vars:

- **Local**: `.env` na máquina do dev.
- **QA**: serviços no Render (só os repos que têm branch `qa` — nem todos
  têm).
- **Produção**: cluster GKE, hoje com secrets aplicados via `TF_VAR_*` em
  `infra-platform/secrets.tf` → `kubernetes_secret`.

Hoje as secrets estão descentralizadas (uma cópia mental em cada ambiente) e
os nomes de variável divergem entre serviços e até dentro do mesmo domínio
(ex.: `DB_URL` usado tanto para JDBC Postgres quanto, em outros serviços,
para Mongo/Neo4j com nomes próprios). Foi criado um projeto no **Infisical**
com os ambientes `Local` / `QA` / `Production` para ser a fonte única de
verdade, alimentando os três destinos (local via CLI, Render, GKE).

## Escopo

Todos os repositórios da org `Solierrr`, exceto `elos-backend` (fora de
escopo — motivo não detalhado pelo usuário). Repositório `.github` (templates
org-wide) também está no escopo como veículo dos workflows reutilizáveis.

### Classificação observada dos repositórios

> ⚠️ Pendente de confirmação do usuário — classificação inferida a partir do
> conteúdo de cada repo (branches, `.env.example`, workflows existentes).

| Repo | Deploy | Branch `qa` hoje | Datastore(s) | Observação |
|---|---|---|---|---|
| ai-accessibility | sim | sim (remota, nova) | — | sem `.env.example` ainda |
| ai-assistant | sim | sim | Mongo (checkpointer), Upstash Redis | consome api-messenger, api-mcp |
| ai-validation | sim | sim | — | só LLM keys |
| ai-billscanner | ? | não | ? | repo praticamente vazio (só LICENSE/README) |
| api-auth | sim | sim | Postgres | JWT issuer |
| api-core | sim | sim | Postgres, Redis | Cloudinary, Google Translate |
| api-mcp (repo renomeado p/ `api-database-mcp` no GitHub) | sim | sim | — | remote local antigo ainda resolve via redirect |
| api-messenger | sim | sim | Mongo | consumido pelo ai-assistant |
| api-recommendation | sim | sim | Postgres (read-only, réplica do api-core), Neo4j | |
| database-console | não (ferramenta interna?) | não | ? | sem `.env.example`, sem workflow qa-sync/release |
| database-rpa | ? | não | ? | repo vazio |
| databricks-analytics | ? | não | ? | repo vazio |
| databricks-sync | cron/job (GH Actions agendado, não serviço long-running) | não | Postgres (core+auth) → Databricks | script Python solto, sem workflow ainda |
| docs-warehouse | não (repo de docs/templates) | não | — | é o próprio repo onde este doc está |
| google-registry | sim (tem Dockerfile) | não ainda | — | sem qa-sync/release ainda |
| infra-gateway | sim (Kong) | sim | — | Helm values por ambiente já existem (`values-dev.yaml`, `values-prod.yaml`) |
| infra-gitops | não (é o repo Argo CD/manifests) | não | — | `services/` só tem manifests p/ ai-assistant, ai-validation, api-auth, api-core, api-messenger, api-recommendation, web-app — faltam api-mcp e infra-gateway |
| infra-otel-collector | sim (k8s), mas **não tem Local nem QA** — só `dev`/`prod` | não | — | usa Grafana Cloud, endpoint igual em dev/prod |
| infra-platform | não (Terraform, controla o cluster em si) | não | — | fonte hoje dos secrets de prod via `TF_VAR_*` |
| mobile-app | ? (tem release.yml, sem qa-sync.yml) | não | — | Flutter provavelmente — modelo de env pode ser diferente (build flavors) |
| web-app | sim | sim | — | Vite, hoje usa `VITE_*`, sem distinção Local/QA/Prod nas env vars, só `VITE_APP_MODE` |

## Decisões já tomadas

1. **Auth do Infisical**: Machine Identity (Universal Auth) por contexto —
   devs usam login pessoal (`infisical login`) só localmente; CI, Render e
   GKE usam Machine Identities dedicadas, sem token pessoal em ambiente
   compartilhado. *(confirmado pelo usuário)*
2. **Escopo de repos**: todos os repos da org exceto `elos-backend`.
   *(confirmado pelo usuário)*
3. **Nomenclatura de variáveis de banco de dados**: prefixo pelo engine, com
   as credenciais de conexão **compartilhadas por instância** (não por
   serviço) e o nome do banco isolado numa variável própria por consumidor
   — porque `api-auth` e `api-core` conectam na mesma instância Postgres,
   só muda o banco:

   ```
   DB_POSTGRES_URI=
   DB_POSTGRES_HOST=
   DB_POSTGRES_PORT=
   DB_POSTGRES_USER=
   DB_POSTGRES_PASSWORD=
   DB_POSTGRES_AUTH=authdb        # nome do banco usado pelo api-auth
   DB_POSTGRES_CORE=coredb        # nome do banco usado pelo api-core

   DB_MONGO_URI=
   ```

   `DB_POSTGRES_URI` é a string de conexão **sem o nome do banco**
   (`postgresql://<user>:<password>@<host>:<port>`), pra quem monta a URL
   completa concatenando com `DB_POSTGRES_AUTH`/`DB_POSTGRES_CORE`; quem
   prefere montar via JDBC usa `HOST`/`PORT`/`USER`/`PASSWORD` +
   `.../${DB_POSTGRES_CORE}` direto no `application.yml`. Mesmo padrão vale
   pra qualquer outro par de serviços que dividam a mesma instância no
   futuro. *(confirmado pelo usuário — exemplo exato fornecido)*

   > ⚠️ Interpretação minha do papel de `DB_POSTGRES_URI` (sem nome do banco)
   > — sinalizar se o app espera outro formato.

## Arquitetura por frente

### 1. Estrutura do projeto Infisical

- Um projeto único, 3 ambientes: `dev` (Local) / `qa` / `prod` (Production).
- Pastas **por categoria/tecnologia**, não por serviço — porque várias
  credenciais são compartilhadas entre serviços (mesma instância Postgres,
  mesma conta Cloudinary, mesmas chaves de LLM) e um folder por serviço
  duplicaria valor. *(confirmado pelo usuário — já está criando `database/`,
  `redis/`, `vite/` no Infisical)*

  | Pasta | Conteúdo | Consumidores |
  |---|---|---|
  | `/database` | `DB_POSTGRES_*` (compartilhado), `DB_POSTGRES_AUTH`/`DB_POSTGRES_CORE` (nome do banco por consumidor), `DB_MONGO_URI`, `DB_MONGO_MESSENGER`/`DB_MONGO_AGENTS` (nome do banco por consumidor, mesmo padrão do Postgres), `DB_NEO4J_URI`/`DB_NEO4J_USER`/`DB_NEO4J_PASSWORD` | api-auth, api-core, api-recommendation (Postgres); api-messenger, ai-assistant (Mongo); api-recommendation (Neo4j); databricks-sync (lê Postgres) |
  | `/redis` | `UPSTASH_AGENTS_*`, `UPSTASH_CORE_*` (mesmo padrão: host/port/username/password por instância) | ai-assistant (`AGENTS`), api-core (`CORE`); api-auth reaproveita `UPSTASH_CORE_*` pra fila de outbox — **assumido, confirmar** |
  | `/cloudinary` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER_PREFIX` | api-core |
  | `/google` | `GOOGLE_TRANSLATE_API_KEY`, `GOOGLE_MAPS_API_KEY`, `GOOGLE_CALENDAR_API_KEY` | api-core (translate), google-registry (todas) |
  | `/llm` | `GOOGLE_API_KEY`, `GROQ_API_KEY`, `GROQ_API_KEY2`, `GEMINI_API_KEY`, `GEMINI_API_KEY2`, `GEMINI_API_KEY3`, `LLM_MODEL`, `LLM_TEMPERATURE` | ai-assistant, ai-validation |
  | `/auth` | `JWT_ISSUER`, `JWT_SECRET`, `JWT_ACCESS_TOKEN_TTL`, `JWT_REFRESH_TOKEN_TTL`, `FIREBASE_ENABLED`, `FIREBASE_PROJECT_ID`, `JWT_KEYSTORE_PASSWORD`, `JWT_ACTIVE_KID`, `JWT_KEYSTORE_BASE64`, `SERVICE_JWT_SECRET` (segredo de confiança serviço-a-serviço, mesmo valor em quem valida), `SERVICE_CLIENT_SECRET` | api-auth (emite), api-core/api-messenger/ai-assistant (validam via `SERVICE_JWT_SECRET`) |
  | `/otel` | `OTEL_EXPORTER_OTLP_ENDPOINT`, `SERVICE_VERSION`, `DEPLOYMENT_ENVIRONMENT`, `OTEL_TRACES_SAMPLING_PROBABILITY`, `GRAFANA_CLOUD_OTLP_ENDPOINT`, `GRAFANA_CLOUD_OTLP_AUTH`, `TAIL_SAMPLING_BASELINE_PCT` | api-core (e outros que instrumentarem), infra-otel-collector |
  | `/databricks` | `DATABRICKS_HOST`, `DATABRICKS_HTTP_PATH`, `DATABRICKS_TOKEN`, `DATABRICKS_CATALOG`, `DATABRICKS_SCHEMA_CORE`, `DATABRICKS_SCHEMA_AUTH` | databricks-sync |
  | `/vite` | `VITE_APP_MODE`, `VITE_MOCKS`, `VITE_LOGS`, `VITE_EXCHANGE_API` | web-app |
  | `/service-urls` | endereços entre serviços, um valor diferente por ambiente (`dev`/`qa`/`prod`) — `API_MESSENGER_URL`, `MCP_URL`, `MCP_API_KEY`, `VITE_API_PERSISTENCE`, `JWT_JWK_SET_URI` | quem consome outro serviço interno — ver seção 3 |
  | `/api-recommendation` | `SYNC_API_KEY`, `RECOMMENDATION_API_KEY`, `SYNC_ON_STARTUP`, `SYNC_BATCH_SIZE`, `SYNC_LOCK_LEASE_SECONDS`, `SYNC_MIN_DOMAIN_RETENTION_RATIO`, `SNAPSHOT_MAX_AGE_SECONDS`, `RECOMMENDATION_RESULT_LIMIT`, `RECOMMENDATION_POOL_LIMIT` | api-recommendation (config de negócio, não credencial — não cabe em nenhuma categoria técnica, fica num folder próprio) |

  **Regra geral pra decidir a pasta**: se é credencial/config de uma
  tecnologia usada por 2+ serviços (banco, cache, storage, chaves de
  terceiro), vai numa pasta por tecnologia. Se é config de negócio de um
  único serviço sem categoria técnica óbvia, vai numa pasta com o nome do
  próprio serviço (só pra esses casos residuais, não como regra geral).

- Machine Identities — **simplificadas pra 3, compartilhadas entre repos**
  (em vez de uma por repo, já que as pastas agora são por categoria e não
  por serviço, isolar por repo perderia sentido na prática):
  - `ci-shared` — Universal Auth, leitura em todas as pastas, nos 3
    ambientes (o workflow escolhe o ambiente certo pelo branch). Client
    ID/Secret guardados como **secret de organização** no GitHub (não por
    repo), assim todo `release.yml`/`qa-sync.yml` novo já funciona sem
    setup manual por repo.
  - `render-shared` — conectada via integração nativa Infisical↔Render,
    sincroniza o ambiente `qa` pra cada serviço Render configurado.
  - `gke-sync` — usada pelo Terraform (via provider Infisical), ambiente
    `prod`, substituindo os `TF_VAR_*` manuais em `secrets.tf`.
  *(assumido a partir do "resto pode criar, segue o mesmo padrão" —
  sinalizar se preferir manter granularidade por repo)*

### 2. Padronização dos `.env.example`

- Cada `.env.example` passa a refletir exatamente os nomes usados no
  Infisical (mesma env var, mesmo nome, sem tradução/mapeamento).
- Bootstrap local vira: `infisical run --env=dev -- <comando de start>` (ou
  `infisical export --env=dev > .env` pra quem preferir um `.env` de
  verdade) — elimina a necessidade de preencher secrets manualmente pra
  rodar local.
- README de cada repo ganha uma seção curta "Como rodar local" com o comando
  acima.

### 3. Resolução de endereço entre serviços por ambiente

O mesmo serviço-alvo tem um endereço diferente dependendo de onde quem
consome está rodando:

| Consumidor → Alvo | Local | QA (Render) | Prod (GKE) |
|---|---|---|---|
| exemplo: ai-assistant → api-messenger | `http://localhost:8080` | `https://api-messenger-qa.onrender.com` | `http://api-messenger:8080` (DNS interno do cluster) |

Em vez de lógica condicional no código, cada URL de serviço-alvo (ex.:
`API_MESSENGER_URL`, `MCP_URL`) é uma **secret/config value que já vem
diferente por ambiente do Infisical**, guardada na pasta `/service-urls`
(seção 1) — o app só lê a env var, sem saber em qual ambiente está (fora dos
poucos casos, como `ai-assistant`, que já usam `ENVIRONMENT=LOCAL/QA/PROD`
pra ajustar comportamento, não endereço).

### 4. CLIs

- **Infisical CLI**: instalar, `infisical login` (dev), `infisical init`
  (linkar repo ao projeto/path), `infisical run --env=<local|qa|prod> -- ...`.
- **Render CLI**: instalar, `render login`, usado para inspecionar/redeployar
  serviços de QA e (futuramente) automatizar criação de serviço quando um
  repo ganha branch `qa`.
- **GCP CLI (`gcloud`)**: instalar, `gcloud auth login`, `gcloud container
  clusters get-credentials` — usado junto do ciclo `terraform apply` /
  `terraform destroy` do `infra-platform` pra subir/derrubar o cluster.

### 5. Release semântico automático

Hoje `release.yml` em cada repo só dispara `docker-publish.yml` (que builda
e taggeia `latest` + `sha` — **sem semver**). Falta:

- Workflow reutilizável no `.github` (mesmo padrão de `docker-publish.yml`)
  que, no push em `main`, olha os commits desde a última tag, aplica o
  padrão `{pattern}: {message}` já definido em `orientacoes.md`
  (`fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE` → major),
  cria tag + GitHub Release, e passa a versão pro `docker-publish.yml`
  taggear a imagem (`vX.Y.Z`) além de `latest`/`sha`.
- Ferramenta candidata: `release-please` (Google) ou `semantic-release` —
  ambos suportam Conventional Commits sem escopo. A decidir na fase de
  implementação dessa frente.

### 6. Sync QA↔main e aviso em PR direto pra main

- `qa-sync.yml` (main→qa, PR automática) já existe e está presente em
  ai-assistant, ai-validation, api-auth, api-core, api-messenger,
  api-recommendation, infra-gateway, web-app — falta padronizar no resto
  dos repos com deploy.
- Falta o outro lado: quando alguém abre PR direto pra `main` (pulando o
  fluxo normal `feature → qa → main`), um workflow comenta na PR — texto
  exato e trigger (todo PR pra main? só quando head não é `qa`?) ainda
  **pendente de confirmação com o usuário**.

## Fases propostas (ordem confirmada pelo usuário: Infisical+envs primeiro)

1. **Fundação Infisical** — estrutura de paths/environments no projeto já
   criado, Machine Identities, piloto em 1 repo (`api-core`, que já tem o
   `.env.example` mais rico) ponta a ponta: local → QA (Render) → prod (TF).
2. **Rollout `.env.example` + wiring Infisical** — replicar o padrão do
   piloto pros demais repos com deploy (lista acima).
3. **Resolução de endereço entre serviços** — preencher a tabela de URLs por
   ambiente no Infisical para todo par consumidor→alvo existente.
4. **CLIs e docs de uso** — Infisical/Render/GCP CLI, um guia por ambiente.
5. **Release semântico automático** — workflow reutilizável de semver.
6. **Sync QA↔main completo** — padronizar `qa-sync.yml` nos repos que faltam
   + workflow de aviso em PR direto pra `main`.

## Itens em aberto (perguntar quando o usuário voltar)

1. Confirmar a classificação de repos da tabela acima (especialmente
   `ai-billscanner`, `database-rpa`, `databricks-analytics`,
   `database-console`, `google-registry`, `mobile-app`, `infra-otel-collector`).
2. Texto/trigger exato do aviso em PR direto pra `main` ("digite merge no
   chat" vs. link de PR pra `qa` vs. outra ideia).
3. Ferramenta de release semântico: `release-please` vs `semantic-release`
   vs script próprio.
4. `mobile-app` (Flutter) provavelmente não usa `.env`/Infisical do mesmo
   jeito (build flavors/`--dart-define`) — confirmar se entra nesse plano ou
   fica de fora.
5. Confirmar as extrapolações marcadas com "assumido" na seção 1 (pastas
   `/redis`, `/otel`, `/api-recommendation`, Machine Identities
   compartilhadas em vez de por repo, e o formato de `DB_POSTGRES_URI` sem
   nome do banco) — segui o padrão dado, mas são interpretações minhas pros
   casos que você não exemplificou.
