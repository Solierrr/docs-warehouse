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
  | `/recommendation` | `API_KEY`, `SYNC_API_KEY`, `RECOMMENDATION_API_KEY`, `SYNC_ON_STARTUP`, `SYNC_BATCH_SIZE`, `SYNC_LOCK_LEASE_SECONDS`, `SYNC_MIN_DOMAIN_RETENTION_RATIO`, `SNAPSHOT_MAX_AGE_SECONDS`, `RECOMMENDATION_RESULT_LIMIT`, `RECOMMENDATION_POOL_LIMIT` | api-recommendation (config/chaves do motor de recomendação) |
  | `/mcp` | `MCP_API_KEY`, `PORT` | api-mcp (chave própria do serviço) |
  | `/agent-queue` | `AGENT_STREAM_*`, `AGENT_CONSUMER_*`, `AGENT_RESULT_*` | ai-assistant (fila de agentes via Redis Streams) |
  | `/outbox` | `OUTBOX_*` | api-auth (padrão outbox pra publicar eventos de usuário) |

  **Regra geral pra decidir a pasta**: se é credencial/config de uma
  tecnologia usada por 2+ serviços (banco, cache, storage, chaves de
  terceiro), vai numa pasta por tecnologia. Se é config de negócio de um
  único serviço sem categoria técnica óbvia, vai numa pasta nomeada pelo que
  a config **representa** (`recommendation`, `mcp`, `agent-queue`,
  `outbox`), nunca pelo nome do serviço que consome — outro serviço pode vir
  a reusar o mesmo conceito no futuro.

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
- Bootstrap local vira: `infisical run --env=local -- <comando de start>` (ou
  `infisical export --env=local > .env` pra quem preferir um `.env` de
  verdade) — elimina a necessidade de preencher secrets manualmente pra
  rodar local.
- README de cada repo ganha uma seção curta "Como rodar local" com o comando
  acima.

### 3. Resolução de endereço entre serviços por ambiente

O mesmo serviço-alvo tem um endereço diferente dependendo de onde quem
consome está rodando. Levantei todo par consumidor→alvo que **existe de
verdade no código hoje** (branch `qa` de cada repo — não inclui integrações
só planejadas em `.env.example` de branches WIP que o código ainda não usa):

| Consumidor → Alvo | Env var | Local | Prod (GKE, DNS interno) | QA (Render) |
|---|---|---|---|---|
| api-auth → api-core | `PERSISTENCE_BASE_URL` | `http://localhost:8080` | `http://api-core:8080` | `https://api-core-cqfn.onrender.com` |
| api-core → api-auth | `JWT_JWK_SET_URI` | `http://localhost:8081/.well-known/jwks.json` | `http://api-auth:8081/.well-known/jwks.json` | `https://api-auth-xw6o.onrender.com/.well-known/jwks.json` |
| api-messenger → api-auth | `JWT_JWK_SET_URI` | `http://localhost:8081/.well-known/jwks.json` | `http://api-auth:8081/.well-known/jwks.json` | `https://api-auth-xw6o.onrender.com/.well-known/jwks.json` |
| web-app → backend | `VITE_API_PERSISTENCE` | `http://localhost:8080` | `https://api-core.34.70.130.195.sslip.io` (via Kong, IP estático reservado - `infra-platform/main.tf:98`) | `https://api-core-cqfn.onrender.com` |

### Serviços QA existentes no Render hoje

Projeto **Solaria**, ambiente **QA** (workspace `Solaria Network's workspace`),
todos branch `qa`, plano `free`, região `oregon`:

| Serviço | Runtime | URL |
|---|---|---|
| web-app | static_site | https://web-app-ldi0.onrender.com |
| ai-assistant | python (nativo — sem Dockerfile, corrigido o start command que estava com placeholder) | https://ai-assistant-5ljd.onrender.com |
| ai-validation | docker | https://ai-validation-jjb7.onrender.com |
| api-auth | docker | https://api-auth-xw6o.onrender.com |
| api-core | docker | https://api-core-cqfn.onrender.com |
| api-messenger | docker | https://api-messenger-5g2n.onrender.com |
| api-recommendation | docker | https://api-recommendation-qlml.onrender.com |
| api-mcp | python (nativo — repo sem Dockerfile) | https://api-mcp-wey6.onrender.com |

`ai-accessibility` (sem código ainda) e `infra-gateway` (Kong, feito pra k8s)
não têm serviço no Render — nada pra rodar/nenhum ganho num Render service
ainda.

**Corrigi em `infra-gitops/services/api-auth/deployment.yaml` um bug real
encontrado nesse levantamento**: o Deployment setava `CORE_BASE_URL`, mas o
Spring só lê `PERSISTENCE_BASE_URL` (`api-auth/src/main/resources/application.properties:29`)
— o nome errado fazia cair no default `localhost:8080` dentro do pod, ou
seja, a chamada api-auth → api-core nunca funcionaria em produção como
estava.

**Planejado mas ainda não implementado no código** (aparecia no
`.env.example` de uma branch de trabalho do `ai-assistant`, mas nenhum
arquivo `.py` do repo lê essas variáveis hoje — não escrevi wiring de infra
pra isso pra não inventar comportamento que o app não tem):
- `ai-assistant → api-messenger` (`API_MESSENGER_URL`)
- `ai-assistant → api-mcp` (`MCP_URL` + `MCP_API_KEY`)

Quando esse código existir, o padrão é o mesmo da tabela acima: local
`http://localhost:<porta>`, prod `http://<service>:<porta>` (DNS interno do
cluster — nunca via Kong, que é só pra entrada externa), QA a URL pública do
Render.

Em vez de lógica condicional no código, cada URL de serviço-alvo é uma
**secret/config value que já vem diferente por ambiente do Infisical**,
guardada na pasta `/service-urls` (seção 1) — o app só lê a env var, sem
saber em qual ambiente está (fora dos poucos casos, como `ai-assistant`, que
já usam `ENVIRONMENT=LOCAL/QA/PROD` pra ajustar comportamento, não
endereço).

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
   `/redis`, `/otel`, `/recommendation`, Machine Identities
   compartilhadas em vez de por repo, e o formato de `DB_POSTGRES_URI` sem
   nome do banco) — segui o padrão dado, mas são interpretações minhas pros
   casos que você não exemplificou.
6. Criar as Machine Identities (`ci-shared`, `render-shared`, `gke-sync`) —
   não existe comando no Infisical CLI pra isso, só dashboard.
7. Popular os secrets de verdade (valores reais) nas 15 pastas × 3
   ambientes — só você tem essas credenciais.
8. Conectar a integração nativa Infisical↔Render (sincronizar `/database`,
   `/redis` etc. do ambiente `qa` pros 7 serviços já criados no Render).
9. `api-mcp` e `ai-assistant` no Render usam runtime Python nativo (sem
   Dockerfile no primeiro, `Dockerfile` corrigido mas não usado pelo Render
   no segundo) — não dá pra trocar runtime via CLI do Render sem recriar o
   serviço; deixei como está, funcional, mas os outros 5 serviços usam
   `docker` — inconsistência a resolver se quiser uniformizar.

## Resolvido nesta sessão (Infisical + Render já configurados de verdade)

- Confirmado via CLI: os slugs dos ambientes são `local`/`qa`/`prod` (não
  `dev` como eu tinha assumido antes — todos os `--env=dev` deste doc e do
  plano foram corrigidos pra `--env=local`).
- Project ID do Infisical: `2296d19c-5f3b-41e1-afa3-fcde39966a71` (já
  default em `infra-platform/variables.tf`).
- As 15 pastas por categoria criadas nos 3 ambientes (`auth`, `database`,
  `google`, `redis`, `vite` já existiam; completei com `cloudinary`, `llm`,
  `otel`, `databricks`, `service-urls`, `recommendation`, `mcp`,
  `agent-queue`, `outbox`, `shared`) — ainda sem secrets/valores. As 4
  residuais foram renomeadas depois: `api-recommendation`→`recommendation`,
  `api-mcp`→`mcp`, `ai-assistant`→`agent-queue`, `api-auth`→`outbox` (nome
  pelo que a config representa, não por quem consome — pedido do usuário).
- Os 3 serviços QA que faltavam (`ai-validation`, `api-recommendation`,
  `api-mcp`) foram criados no Render, no mesmo projeto/ambiente dos outros 5.
- Corrigido o `ai-assistant` no Render, que estava com start command de
  placeholder (`gunicorn your_application.wsgi`, nunca configurado de
  verdade) — agora aponta pro FastAPI real (`src.api.app:app`).
