# Centralização de Secrets (Infisical) e Padronização de Envs — Plano de Implementação

> **Status:** rascunho — Fase 1 detalhada e pronta pra execução após aprovação;
> Fases 2-6 são roadmap de alto nível, a detalhar quando a Fase 1 validar a
> abordagem e os itens em aberto do spec forem confirmados.

**Goal:** centralizar todas as secrets/config do projeto no Infisical (envs
`dev`/`qa`/`prod`), eliminando o gerenciamento manual e descentralizado hoje
espalhado entre `.env` local, Render e `TF_VAR_*` no Terraform, e padronizar
os `.env.example` de todos os repos pra bater com os nomes do Infisical.

**Architecture:** Infisical é a fonte única de verdade por ambiente. Local
consome via Infisical CLI (`infisical run`); QA (Render) via integração
nativa Infisical↔Render ou `infisical run` no start command; Produção (GKE)
via Terraform lendo do Infisical (substituindo `TF_VAR_*` manuais) ou via
Infisical Kubernetes Operator.

**Tech Stack:** Infisical (CLI + projeto já criado), Terraform (GCP/GKE),
Render, GitHub Actions.

**Spec:** [`docs-warehouse/architecture/2026-09-03-secrets-and-envs-design.md`](../architecture/2026-09-03-secrets-and-envs-design.md)

## Global Constraints

- Commits seguem `orientacoes.md`: padrão `{pattern}: {message}`, minúsculo,
  inglês, sem escopo entre parênteses, sem identidade de IA no commit.
- Merge sempre para `qa`, nunca direto pra `main` (branches `tipo/descricao-curta`).
- Nunca commitar `.claude`, `.sdd`, `docs/specs`, `specs` — checar `.gitignore`.
- Nomenclatura de DB definida no spec: credenciais compartilhadas por
  instância (`DB_POSTGRES_URI`/`HOST`/`PORT`/`USER`/`PASSWORD`) + nome do
  banco isolado por consumidor (`DB_POSTGRES_AUTH`, `DB_POSTGRES_CORE`).
  Pastas do Infisical por categoria/tecnologia (`/database`, `/redis`,
  `/cloudinary`, `/google`, `/otel`, `/auth`, ...), não por serviço.

---

## Fase 1 — Fundação Infisical + piloto (`api-core`)

Escolhido `api-core` como piloto: já tem o `.env.example` mais completo (DB,
Redis, Cloudinary, OTEL, Google Translate) e já tem `kubernetes_secret`
definido no Terraform (`infra-platform/secrets.tf:86-106`), então cobre os
três destinos (local, QA-Render, prod-GKE) num único serviço.

### Task 1: Estruturar o projeto Infisical (pastas por categoria, environments, machine identities)

**Files:** nenhum arquivo de código — trabalho feito no dashboard/CLI do Infisical.

**Interfaces:**
- Produz: os secret paths por categoria e os IDs de Machine Identity que as
  próximas tasks vão referenciar.

- [x] **Passo 1: Confirmar os 3 environments do projeto Infisical**

Confirmado via CLI (`infisical secrets folders get`): os slugs são `local`,
`qa`, `prod` — **não** `dev`. Todos os comandos deste plano já usam
`--env=local` pro ambiente Local.

- [x] **Passo 2: Criar as pastas por categoria**

Criadas via CLI (`infisical secrets folders create --projectId <id> --env
<local|qa|prod> --path / --name <pasta>`) nos 3 environments — `auth`,
`database`, `google`, `redis`, `vite` já existiam (criadas manualmente
antes); completei com `cloudinary`, `llm`, `otel`, `databricks`,
`service-urls`, `shared` e as 4 residuais nomeadas pelo que representam
(não pelo serviço que consome — `recommendation`, `mcp`, `agent-queue`,
`outbox`), 15 pastas no total, iguais nos 3 ambientes:

```
/auth
/database
/google
/redis
/vite
/cloudinary
/llm
/otel
/databricks
/service-urls
/recommendation
/mcp
/agent-queue
/outbox
/shared
```

- [ ] **Passo 3: Criar a Machine Identity `ci-shared`**

No Infisical, criar uma Machine Identity `ci-shared` com Universal Auth,
permissão de **leitura em todas as pastas**, nos 3 environments (o workflow
do GitHub Actions escolhe o environment em runtime pelo branch). Anotar
`Client ID` e `Client Secret` — vão virar um **secret de organização** no
GitHub (`INFISICAL_CLIENT_ID`/`INFISICAL_CLIENT_SECRET`), não por repo, na
Task 2 da Fase 2 (setup de CI).

- [ ] **Passo 4: Confirmar acesso local (dev pessoal)**

Não é Machine Identity — é o próprio login pessoal. Rodar `infisical login`
localmente (instalação do CLI é a Task 2 deste plano) e confirmar acesso de
leitura ao projeto.

- [ ] **Passo 5: Criar a Machine Identity `gke-sync`**

Criar Machine Identity `gke-sync` com Universal Auth, permissão de leitura
em todas as pastas, environment `prod` só. Anotar `Client ID`/`Client
Secret` — vão virar variável de ambiente no runner que roda `terraform
apply` (não commitados).

- [ ] **Passo 6: Criar a Machine Identity `render-shared`**

Criar Machine Identity `render-shared` com Universal Auth, permissão de
leitura em todas as pastas, environment `qa` só — usada na Task 9 (integração
nativa Infisical↔Render).

### Task 2: Instalar e configurar o Infisical CLI localmente

**Files:**
- Modify: `api-core/.gitignore` (garantir que `.infisical.json` gerado pelo
  `infisical init` não é ignorado — ele **não** contém secrets, só o
  workspace ID, e deve ser commitado pra outros devs não precisarem repetir
  o `init`)

- [ ] **Passo 1: Instalar o CLI**

```bash
winget install Infisical.infisical
```

Verificar instalação:

```bash
infisical --version
```

Expected: imprime uma versão (ex. `0.3x.x`), sem erro de comando não
encontrado.

- [ ] **Passo 2: Login pessoal**

```bash
infisical login
```

Segue o fluxo OAuth no browser. Expected: mensagem de sucesso no terminal.

- [ ] **Passo 3: Linkar o repo `api-core` ao projeto Infisical**

Dentro de `Inter/api-core`:

```bash
infisical init
```

Escolher o projeto já criado. Isso gera `api-core/.infisical.json`.

- [ ] **Passo 4: Commitar o `.infisical.json`**

```bash
git add .infisical.json
git commit -m "chore: link repo to infisical project"
```

(Branch: criar `chore/infisical-setup` a partir de `qa` antes deste commit,
seguindo o padrão de branch de `orientacoes.md`.)

### Task 3: Migrar os secrets do `api-core` pro Infisical, distribuídos pelas pastas por categoria (environment `dev`)

**Files:**
- Read: `api-core/.env.example` (fonte dos nomes de variável atuais)

**Interfaces:**
- Consumes: pastas criadas na Task 1.
- Produces: as secret keys abaixo, disponíveis nas pastas do environment
  `dev`, consumidas pela Task 6 (rodar local).

- [ ] **Passo 1: Popular `/database`**

Valores de `DB_POSTGRES_AUTH` também entram aqui mesmo sendo do `api-auth`
(fora do escopo do piloto) porque a pasta é compartilhada — não custa nada
deixar pronta pra Fase 2:

```bash
infisical secrets set DB_POSTGRES_URI="postgresql://postgres:postgres@localhost:5432" --env=local --path=/database
infisical secrets set DB_POSTGRES_HOST="localhost" --env=local --path=/database
infisical secrets set DB_POSTGRES_PORT="5432" --env=local --path=/database
infisical secrets set DB_POSTGRES_USER="postgres" --env=local --path=/database
infisical secrets set DB_POSTGRES_PASSWORD="postgres" --env=local --path=/database
infisical secrets set DB_POSTGRES_CORE="coredb" --env=local --path=/database
infisical secrets set DB_POSTGRES_AUTH="authdb" --env=local --path=/database
```

- [ ] **Passo 2: Popular `/redis`**

```bash
infisical secrets set UPSTASH_CORE_HOST="localhost" --env=local --path=/redis
infisical secrets set UPSTASH_CORE_PORT="6379" --env=local --path=/redis
infisical secrets set UPSTASH_CORE_USERNAME="default" --env=local --path=/redis
infisical secrets set UPSTASH_CORE_PASSWORD="" --env=local --path=/redis
```

- [ ] **Passo 3: Popular `/cloudinary`**

```bash
infisical secrets set CLOUDINARY_CLOUD_NAME="<valor real>" --env=local --path=/cloudinary
infisical secrets set CLOUDINARY_API_KEY="<valor real>" --env=local --path=/cloudinary
infisical secrets set CLOUDINARY_API_SECRET="<valor real>" --env=local --path=/cloudinary
infisical secrets set CLOUDINARY_FOLDER_PREFIX="solier" --env=local --path=/cloudinary
```

- [ ] **Passo 4: Popular `/google`**

```bash
infisical secrets set GOOGLE_TRANSLATE_API_KEY="<valor real>" --env=local --path=/google
```

- [ ] **Passo 5: Popular `/auth`**

```bash
infisical secrets set SERVICE_JWT_SECRET="qualquerstringde32letrasaisenaoelepara" --env=local --path=/auth
```

- [ ] **Passo 6: Popular `/otel`**

```bash
infisical secrets set OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4318" --env=local --path=/otel
infisical secrets set SERVICE_VERSION="dev" --env=local --path=/otel
infisical secrets set DEPLOYMENT_ENVIRONMENT="local" --env=local --path=/otel
infisical secrets set OTEL_TRACES_SAMPLING_PROBABILITY="1.0" --env=local --path=/otel
```

- [ ] **Passo 7: Validar a leitura recursiva**

```bash
infisical secrets --env=local --path=/ --recursive
```

Expected: lista as ~20 chaves das 6 pastas acima com valores mascarados.

### Task 4: Atualizar `application.properties` do `api-core` pros novos nomes de variável

O arquivo hoje lê `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`/`DB_SSLMODE` e
`REDIS_URL` — precisam compor a partir das variáveis novas
(`DB_POSTGRES_*`/`UPSTASH_CORE_*`) já que essas não existem mais como uma
URL única pronta.

**Files:**
- Modify: `api-core/src/main/resources/application.properties:1-11,22`

- [ ] **Passo 1: Trocar a config de datasource**

Em `api-core/src/main/resources/application.properties`, linhas 5-10, trocar:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/dbsolier}
spring.datasource.username=${DB_USERNAME:solier}
spring.datasource.password=${DB_PASSWORD:solier}

spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.hikari.data-source-properties.sslmode=${DB_SSLMODE:disable}
```

por:

```properties
spring.datasource.url=jdbc:postgresql://${DB_POSTGRES_HOST:localhost}:${DB_POSTGRES_PORT:5432}/${DB_POSTGRES_CORE:dbsolier}
spring.datasource.username=${DB_POSTGRES_USER:solier}
spring.datasource.password=${DB_POSTGRES_PASSWORD:solier}

spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.hikari.data-source-properties.sslmode=${DB_POSTGRES_SSLMODE:disable}
```

- [ ] **Passo 2: Trocar a config de Redis**

Na linha 22, trocar:

```properties
spring.data.redis.url=${REDIS_URL:redis://localhost:6379}
```

por:

```properties
spring.data.redis.url=redis://${UPSTASH_CORE_USERNAME:default}:${UPSTASH_CORE_PASSWORD:}@${UPSTASH_CORE_HOST:localhost}:${UPSTASH_CORE_PORT:6379}
```

- [ ] **Passo 3: Rodar os testes existentes do repo**

```bash
cd Inter/api-core
./mvnw test
```

(trocar `./mvnw test` pelo comando real, se o wrapper do projeto for
diferente — confirmar em `api-core/README.md`)

Expected: suíte passa igual passava antes — a mudança é só de onde a URL
vem, não de comportamento.

- [ ] **Passo 4: Commit**

```bash
git add src/main/resources/application.properties
git commit -m "refactor: read db and redis config from infisical var names"
```

### Task 5: Rodar o `api-core` localmente via `infisical run` (sem `.env` manual)

**Files:**
- Modify: `api-core/README.md` (adicionar seção "Como rodar local")
- Modify: `api-core/.env.example` (reescrever pros nomes novos, agrupados
  por pasta — ver Task 3)

**Interfaces:**
- Consumes: as secret keys da Task 3, environment `dev`; `application.properties`
  atualizado na Task 4.
- Produces: comando `infisical run --env=local --path=/ --recursive -- <start>`
  documentado, reusado nas próximas fases pra outros repos.

- [ ] **Passo 1: Descobrir o comando de start atual do `api-core`**

Ler `api-core/README.md` ou `pom.xml`/`build.gradle` pra confirmar o comando
(ex. `./mvnw spring-boot:run` ou `./gradlew bootRun`).

- [ ] **Passo 2: Rodar com Infisical injetando as env vars**

```bash
cd Inter/api-core
infisical run --env=local --path=/ --recursive -- ./mvnw spring-boot:run
```

(trocar `./mvnw spring-boot:run` pelo comando real encontrado no Passo 1;
`--recursive` injeta as variáveis de todas as subpastas — `/database`,
`/redis`, `/cloudinary`, `/google`, `/auth`, `/otel` — de uma vez)

Expected: a aplicação sobe normalmente, sem erro de env var faltando —
prova que o Infisical está substituindo o `.env` manual.

- [ ] **Passo 3: Reescrever o `.env.example` pros nomes novos**

Substituir o conteúdo de `api-core/.env.example` por:

```bash
# Fonte de verdade real é o Infisical — este arquivo só documenta quais
# variáveis existem. Ver "Como rodar local" no README.

# /database (compartilhado com api-auth)
DB_POSTGRES_URI=
DB_POSTGRES_HOST=
DB_POSTGRES_PORT=
DB_POSTGRES_USER=
DB_POSTGRES_PASSWORD=
DB_POSTGRES_CORE=dbsolier
DB_POSTGRES_SSLMODE=disable

# /redis
UPSTASH_CORE_HOST=
UPSTASH_CORE_PORT=
UPSTASH_CORE_USERNAME=
UPSTASH_CORE_PASSWORD=

# /auth
SERVICE_JWT_SECRET=

# /cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER_PREFIX=solier

# /google
GOOGLE_TRANSLATE_API_KEY=

# /otel
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
SERVICE_VERSION=dev
DEPLOYMENT_ENVIRONMENT=local
OTEL_TRACES_SAMPLING_PROBABILITY=1.0

# /service-urls
JWT_JWK_SET_URI=http://localhost:8081/.well-known/jwks.json
```

- [ ] **Passo 4: Documentar no README**

Adicionar em `api-core/README.md`:

```markdown
## Como rodar local

1. Instale o [Infisical CLI](https://infisical.com/docs/cli/overview) e rode `infisical login`.
2. Na raiz do repo, rode `infisical init` (uma vez só) e escolha o projeto do time.
3. Suba o serviço com:

   \`\`\`bash
   infisical run --env=local --path=/ --recursive -- ./mvnw spring-boot:run
   \`\`\`

Não é mais necessário copiar `.env.example` pra `.env` manualmente — o Infisical injeta as variáveis em runtime.
```

- [ ] **Passo 5: Commit**

```bash
git add README.md .env.example
git commit -m "docs: document infisical local run flow"
```

### Task 6: Popular o environment `prod` no Infisical com os valores atuais do Terraform

**Files:**
- Read: `infra-platform/secrets.tf:86-106` (valores/nomes atuais das
  `kubernetes_secret.api_core`)

**Interfaces:**
- Consumes: nenhuma
- Produces: as secret keys de produção nas pastas `/database`, `/redis`,
  `/cloudinary`, `/google`, environment `prod`, consumidas pela Task 7.

- [ ] **Passo 1: Popular `/database`, `/redis`, `/cloudinary` e `/google`**

```bash
infisical secrets set DB_POSTGRES_URI="<valor real de prod>" --env=prod --path=/database
infisical secrets set DB_POSTGRES_HOST="<valor real de prod>" --env=prod --path=/database
infisical secrets set DB_POSTGRES_PORT="5432" --env=prod --path=/database
infisical secrets set DB_POSTGRES_USER="<valor real de prod>" --env=prod --path=/database
infisical secrets set DB_POSTGRES_PASSWORD="<valor real de prod>" --env=prod --path=/database
infisical secrets set DB_POSTGRES_CORE="coredb" --env=prod --path=/database
infisical secrets set DB_POSTGRES_AUTH="authdb" --env=prod --path=/database

infisical secrets set UPSTASH_CORE_HOST="<valor real de prod>" --env=prod --path=/redis
infisical secrets set UPSTASH_CORE_PORT="<valor real de prod>" --env=prod --path=/redis
infisical secrets set UPSTASH_CORE_USERNAME="<valor real de prod>" --env=prod --path=/redis
infisical secrets set UPSTASH_CORE_PASSWORD="<valor real de prod>" --env=prod --path=/redis

infisical secrets set CLOUDINARY_CLOUD_NAME="<valor real>" --env=prod --path=/cloudinary
infisical secrets set CLOUDINARY_API_KEY="<valor real>" --env=prod --path=/cloudinary
infisical secrets set CLOUDINARY_API_SECRET="<valor real>" --env=prod --path=/cloudinary
infisical secrets set CLOUDINARY_FOLDER_PREFIX="solier" --env=prod --path=/cloudinary

infisical secrets set GOOGLE_TRANSLATE_API_KEY="<valor real>" --env=prod --path=/google
```

(valores reais vêm de onde estão guardados hoje — provavelmente num
gerenciador de senha pessoal do usuário, já que o `secrets.tf` só tem
defaults vazios `""`)

- [ ] **Passo 2: Validar**

```bash
infisical secrets --env=prod --path=/ --recursive
```

Expected: as chaves das 4 pastas listadas, com valores mascarados.

### Task 7: Terraform lê do Infisical em vez de `TF_VAR_*` manual

**Files:**
- Modify: `infra-platform/secrets.tf:1-106` (adicionar provider Infisical,
  trocar `default = ""` das variáveis do `api-core` por leitura via
  data source)
- Modify: `infra-platform/versions.tf` (adicionar o provider
  `infisical/infisical` nos `required_providers`)

**Interfaces:**
- Consumes: Machine Identity `gke-sync` (Task 1, Passo 5), secrets das
  pastas `/database`, `/redis`, `/cloudinary`, `/google`, env `prod` (Task 6).
- Produces: `kubernetes_secret.api_core` populado sem intervenção manual.

- [ ] **Passo 1: Adicionar o provider Infisical**

Em `infra-platform/versions.tf`, dentro de `required_providers`:

```hcl
infisical = {
  source  = "Infisical/infisical"
  version = "~> 0.15"
}
```

- [ ] **Passo 2: Configurar o provider**

No topo de `infra-platform/secrets.tf` (ou em `main.tf`, seguindo onde os
outros providers já estão configurados):

```hcl
provider "infisical" {
  host = "https://app.infisical.com"
  auth = {
    universal = {
      client_id     = var.infisical_client_id
      client_secret = var.infisical_client_secret
    }
  }
}
```

Adicionar em `infra-platform/variables.tf`:

```hcl
variable "infisical_client_id" {
  type        = string
  description = "Client ID da Machine Identity gke-sync do Infisical"
  sensitive   = true
}

variable "infisical_client_secret" {
  type        = string
  description = "Client Secret da Machine Identity gke-sync do Infisical"
  sensitive   = true
}
```

- [ ] **Passo 3: Trocar as variáveis do api-core por data sources por pasta**

Em `infra-platform/secrets.tf`, substituir o bloco de variáveis
`api_core_*` (linhas 30-84 hoje) e o `data` do `kubernetes_secret.api_core`
por (um `data` source por pasta, merge dos 4 no `kubernetes_secret`):

```hcl
data "infisical_secrets" "database" {
  env_slug     = "prod"
  workspace_id = var.infisical_project_id
  folder_path  = "/database"
}

data "infisical_secrets" "redis" {
  env_slug     = "prod"
  workspace_id = var.infisical_project_id
  folder_path  = "/redis"
}

data "infisical_secrets" "cloudinary" {
  env_slug     = "prod"
  workspace_id = var.infisical_project_id
  folder_path  = "/cloudinary"
}

data "infisical_secrets" "google" {
  env_slug     = "prod"
  workspace_id = var.infisical_project_id
  folder_path  = "/google"
}

resource "kubernetes_secret" "api_core" {
  metadata {
    name      = "api-core-secrets"
    namespace = "default"
  }

  data = merge(
    { for name, secret in data.infisical_secrets.database.secrets : name => secret.value },
    { for name, secret in data.infisical_secrets.redis.secrets : name => secret.value },
    { for name, secret in data.infisical_secrets.cloudinary.secrets : name => secret.value },
    { for name, secret in data.infisical_secrets.google.secrets : name => secret.value },
  )

  type = "Opaque"

  depends_on = [google_container_node_pool.primary_nodes]
}
```

Isso traz junto `DB_POSTGRES_AUTH` (não usado pelo `api-core`, é do
`api-auth`) porque a pasta `/database` é compartilhada — inofensivo, o
Spring só lê as chaves que conhece. Na Fase 2, `api-auth` reusa os mesmos
4 `data` sources (só monta um `kubernetes_secret.api_auth` separado, lendo
`DB_POSTGRES_AUTH` em vez de `DB_POSTGRES_CORE`).

Adicionar `infisical_project_id` em `variables.tf` (valor: o Workspace ID
visível no dashboard do Infisical).

- [ ] **Passo 4: Rodar `terraform plan`**

```bash
cd Inter/infra-platform
export TF_VAR_infisical_client_id="<client id da gke-sync>"
export TF_VAR_infisical_client_secret="<client secret da gke-sync>"
export TF_VAR_infisical_project_id="<workspace id>"
terraform plan
```

Expected: plan mostra `kubernetes_secret.api_core` sendo atualizado com os
valores reais das 4 pastas (não mais `""`), sem erro de autenticação do
provider Infisical.

- [ ] **Passo 5: Commit (sem aplicar ainda)**

```bash
git checkout -b feature/infisical-secrets-api-core
git add secrets.tf versions.tf variables.tf
git commit -m "feat: read api-core secrets from infisical"
```

Não faz `terraform apply` nesta task — isso é uma ação com blast radius em
produção (mexe no cluster real) e deve ser confirmada explicitamente com o
usuário antes de rodar, fora do escopo deste plano de documentação/setup.

### Task 8: Validar QA (Render) — piloto do `api-core`

> ⚠️ `api-core` ainda não tem branch `qa` nem serviço no Render hoje (só
> aparece como tendo branch `qa` local — confirmar se já existe integração
> Render antes de executar esta task; se não existir, criar o serviço no
> Render é uma ação fora deste plano, feita manualmente pelo usuário no
> dashboard do Render, já que envolve conectar uma conta/pagamento).

**Files:** nenhum (configuração no dashboard do Render)

- [ ] **Passo 1: Conectar a Machine Identity `render-shared` no serviço Render**

Usar a integração nativa Infisical↔Render (Project Settings → Integrations
→ Render, no dashboard do Infisical) apontando pras pastas `/database`,
`/redis`, `/cloudinary`, `/google`, `/auth`, `/otel`, environment `qa`,
sincronizando pro serviço Render do `api-core`.

- [ ] **Passo 2: Popular o environment `qa` no Infisical**

```bash
infisical secrets set DB_POSTGRES_URI="<valor real de qa>" --env=qa --path=/database
infisical secrets set DB_POSTGRES_HOST="<valor real de qa>" --env=qa --path=/database
infisical secrets set DB_POSTGRES_PORT="5432" --env=qa --path=/database
infisical secrets set DB_POSTGRES_USER="<valor real de qa>" --env=qa --path=/database
infisical secrets set DB_POSTGRES_PASSWORD="<valor real de qa>" --env=qa --path=/database
infisical secrets set DB_POSTGRES_CORE="coredb" --env=qa --path=/database
infisical secrets set DB_POSTGRES_AUTH="authdb" --env=qa --path=/database

infisical secrets set UPSTASH_CORE_HOST="<valor real de qa>" --env=qa --path=/redis
infisical secrets set UPSTASH_CORE_PORT="<valor real de qa>" --env=qa --path=/redis
infisical secrets set UPSTASH_CORE_USERNAME="<valor real de qa>" --env=qa --path=/redis
infisical secrets set UPSTASH_CORE_PASSWORD="<valor real de qa>" --env=qa --path=/redis

infisical secrets set CLOUDINARY_CLOUD_NAME="<valor real>" --env=qa --path=/cloudinary
infisical secrets set CLOUDINARY_API_KEY="<valor real>" --env=qa --path=/cloudinary
infisical secrets set CLOUDINARY_API_SECRET="<valor real>" --env=qa --path=/cloudinary
infisical secrets set CLOUDINARY_FOLDER_PREFIX="solier" --env=qa --path=/cloudinary

infisical secrets set GOOGLE_TRANSLATE_API_KEY="<valor real>" --env=qa --path=/google
infisical secrets set SERVICE_JWT_SECRET="<valor real de qa>" --env=qa --path=/auth
```

- [ ] **Passo 3: Redeployar e validar**

Disparar um redeploy manual no Render (a integração sincroniza as env vars
antes do build). Expected: serviço sobe sem erro de env var faltando, logs
não mostram fallback pra valores vazios.

---

## Fases 2-6 — Roadmap (a detalhar em planos próprios após validar a Fase 1)

Cada fase abaixo vira seu próprio plano detalhado (mesmo formato da Fase 1)
quando for começar — não faz sentido detalhar bite-sized agora porque
dependem de decisões ainda em aberto (ver spec, seção "Itens em aberto") e
do aprendizado da Fase 1.

### Fase 2 — Rollout pros demais repos com deploy

Repetir o padrão da Fase 1 (Tasks 3-9) para: `api-auth`, `api-messenger`,
`api-recommendation`, `ai-assistant`, `ai-validation`, `ai-accessibility`,
`api-mcp`/`api-database-mcp`, `infra-gateway`, `web-app`. As pastas por
categoria já existem (Task 1) e os `data "infisical_secrets"` por pasta já
existem no Terraform (Task 7) — cada repo novo só soma um
`kubernetes_secret` próprio puxando as chaves relevantes das pastas
compartilhadas (ex.: `api-auth` reusa `data.infisical_secrets.database` e
lê `DB_POSTGRES_AUTH` em vez de `DB_POSTGRES_CORE`).

### Fase 3 — Resolução de endereço entre serviços

Preencher, pra cada par consumidor→alvo hoje existente (mapeado no spec,
seção 3), as 3 variantes de URL (local/QA/prod) como secrets no Infisical.
Requer primeiro levantar a lista completa de pares consumidor→alvo (grep
por `_URL`/`_URI` apontando pra outro serviço em cada `.env.example`).

### Fase 4 — CLIs e documentação de uso

Guia único (`docs-warehouse`) cobrindo Infisical CLI, Render CLI e `gcloud`,
com uma seção por ambiente (local/QA/prod) — o que instalar, como logar,
comandos do dia a dia (`infisical run`, `render deploys create`, `gcloud
container clusters get-credentials` + `terraform apply`/`destroy`).

### Fase 5 — Release semântico automático

Escolher ferramenta (`release-please` vs `semantic-release`, item em aberto
no spec), criar workflow reutilizável em `Solierrr/.github`, testar num
repo piloto, depois replicar via `release.yml` nos demais repos com deploy.

### Fase 6 — Sync QA↔main completo

Padronizar `qa-sync.yml` (já existe em 8 repos) nos que faltam
(`ai-accessibility`, `api-mcp`, `google-registry` se entrar no escopo de
deploy) + criar o workflow de aviso em PR direta pra `main` — texto/trigger
exatos ainda pendentes de confirmação com o usuário (spec, item 3).
