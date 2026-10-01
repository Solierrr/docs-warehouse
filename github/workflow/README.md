# github/workflow/

Modelos de `.github/workflows/` (CI, Code Quality, SonarQube, Release), um
diretório por stack. Copie os arquivos da pasta correspondente para
`.github/workflows/` de um repositório novo (ou com o pipeline quebrado) em
vez de começar do zero.

| Stack | Pasta | Exemplo de repositório |
|---|---|---|
| Python | `python/` | ai-assistant, ai-validation, api-recommendation |
| Java + Maven | `java/` | api-messenger, api-persistence |
| Kotlin + Maven (Spring Boot) | `kotlin/springboot/` | api-auth |
| Kotlin + Gradle (Jetpack Compose / Android) | `kotlin/jetpack-compose/` | mobile-app |
| TypeScript + Node | `typescript/` | web-app |

## Pegadinhas já resolvidas aqui

- **`sonarqube.yml`**: precisa de `github-token` e `run-id` no passo
  `actions/download-artifact@v4`. Sem isso, o job (disparado via
  `workflow_run`) procura o artefato `coverage` na própria run em vez da run
  do CI que o disparou, e sempre falha com
  `Artifact not found for name: coverage`.
- **`quality.yml` (Java)**: `google_checks.xml` marca praticamente tudo como
  severidade `warning` por padrão — use
  `-Dcheckstyle.violationSeverity=error` para falhar só em problema real,
  não em estilo/indentação.
- **`quality.yml` (Kotlin/ktlint)**: todas as regras `standard:*` do ktlint
  são de formatação. Para não travar o build em estilo, adicione ao
  `.editorconfig` do projeto:
  ```
  [*.{kt,kts}]
  ktlint_standard = disabled
  ktlint_standard_no-unused-imports = enabled
  ktlint_standard_no-wildcard-imports = enabled
  ```
- **`ci.yml` (Java/Kotlin)**: `mvnw`/`gradlew` precisam estar commitados com
  o bit de execução (modo `100755`). Confira com
  `git ls-files -s mvnw` / `git ls-files -s gradlew`; corrija com
  `git update-index --chmod=+x mvnw` se aparecer `100644`.
- **`release.yml`**: precisa do bloco `permissions: { contents: read,
  pull-requests: write }` no job que chama `docker-publish.yml`. Sem isso, o
  run falha com `startup_failure` (zero jobs) assim que o reusable workflow
  central tenta comentar na PR — o token do caller nunca escala além do
  `default_workflow_permissions` do repo/org (hoje `read`), então o pedido de
  `pull-requests: write` do reusable é recusado antes mesmo do job começar.
  Isso ficou quebrado silenciosamente em vários repos por semanas até ser
  encontrado.

## Fora do escopo

Repositórios sem código de aplicação (só scaffold/infra, ex: Helm/Terraform)
não devem ter esses workflows — eles não têm o que testar/analisar.

## QA sync

`qa-sync.yml` **não** dispara mais sozinho a cada push em `main` — o gatilho
automático foi trocado por uma checkbox de 1 clique, pra evitar sincronizar QA
antes da hora. Quando uma PR pra `main` é mergeada, o próprio `qa-sync.yml` do
repo publica a checkbox na conversa. Ao marcá-la, o caller cria ou reutiliza a
PR `main` → `qa`, solicita o auto-merge por squash e atualiza o comentário com
o estado e o link. O GitHub só conclui o merge depois que as regras da branch
forem satisfeitas; em caso de conflito, o comentário aponta para a PR de sync.
O auto-merge precisa estar habilitado nas configurações do repositório. Esse
fluxo só faz sentido em repositórios que têm branch `qa` de verdade — não
adicionar em repos que fazem merge direto pra `main` (ver `servicos.md` do
VersoSpec do Solaria pra saber quais).

A PR criada automaticamente usa o título
`chore(sync): synchronize main into qa`. Sua descrição informa que o diff
contém apenas commits já integrados em `main`, que o efeito é atualizar o
ambiente de QA após o merge, e que a validação esperada é revisar esse diff.

## Arquivos comuns (`common/`)

Arquivos que valem para qualquer stack, copiados para `.github/workflows/` (ou
para a raiz do repo, no caso do config/manifest):

| Arquivo | Para quê |
|---|---|
| `release-please.yml` | Caller do release-please: abre/atualiza a PR de release, aceita `/release` e o checkbox, e finaliza a publicação. Repassa `RELEASE_BOT_TOKEN` ao workflow central. |
| `release-please-config.json` + `.release-please-manifest.json` | Config e manifest (`release-type: simple`, versão inicial `0.1.0`). Trocar `<nome-do-repo>` em `package-name`. |
| `pr-welcome.yml` | Comenta na abertura da PR o que vai acontecer depois do merge (checkbox de sync com `qa`, imagem Docker, release). |
| `npm-publisher.yml` | Publica pacote npm a cada push na `main`, só se a versão do `package.json` ainda não existir no registro. Precisa do secret `NPM_TOKEN` e de `id-token: write` (provenance). |
| `environment-status-alive.yml` | `environment-status.yml` para serviços sem QA/PROD (Render sandbox): registra o ambiente `ALIVE` no GitHub por checagem HTTP. |

## Release Please e auto-merge

- Os comentários pós-merge (checkbox de `qa` e checkbox/`/release` de release)
  vêm dos workflows centrais de `Solierrr/.github`; qualquer repo com os
  callers `qa-sync.yml`/`release-please.yml` os recebe. O `pr-welcome.yml` só
  explica o fluxo na abertura da PR.
- **Allow auto-merge** foi habilitado em todos os repositórios não arquivados
  da org, exceto `elos-*` (2026-09-30). A opção só permite `gh pr merge --auto`;
  nenhuma PR manual é mergeada sozinha. Só o sync com `qa` e a release chamam
  `--auto`.
- **Sync com `qa`**: a `qa-protection` exige PR e 0 aprovações, então o auto-merge
  conclui sozinho quando os checks passam.
- **Release**: a `main-protection` exige 1 aprovação e a PR de release é aberta
  por `github-actions[bot]`, que não aprova a própria PR. O workflow central
  `release-please-merge.yml` usa o secret opcional de org `RELEASE_BOT_TOKEN`
  (PAT/GitHub App de outra identidade, com permissão de escrita) para aprovar e
  pedir o auto-merge, somente depois de checar que quem comentou tem
  admin/maintain/write. Sem o secret, o `/release` só liga o auto-merge e a
  aprovação continua manual. Cada caller precisa repassar o secret:
  `secrets: { RELEASE_BOT_TOKEN: ${{ secrets.RELEASE_BOT_TOKEN }} }` no job
  `release-please-merge`.
- Armadilha: passar um secret que o workflow reutilizável não declara faz o
  caller falhar; por isso a PR do `.github` (declaração do secret) precisa entrar
  antes das PRs dos callers.

## Ambiente `ALIVE` (sandbox no Render)

Serviços sem QA/PROD (`web-sandbox`, `databricks-sync`) registram o ambiente
`ALIVE` com `environment-status-alive.yml` (`workflow_dispatch`, `check: http`).
O `check: render` chegou a ser tentado, mas o workflow central só suporta `http`
e `gcloud-cluster`. Em 2026-09-30 os dois receberam esse workflow, o
release-please e a primeira release (`v0.2.0`).

## Publicação no npm (`npm-publisher.yml`)

Usado pelo `lib-web` (`@solaria.network/web-lib`). Roda a cada push na `main`, como o
workflow de Docker, e publica só se `name@version` do `package.json` ainda não existir
no npm; a versão muda quando a PR do release-please é mergeada.

- Não usa `on: release`: releases criadas pelo release-please com o token padrão do
  Actions não disparam outros workflows, então o publish nunca rodaria.
- A consulta distingue pacote inexistente (`E404`, publica) de qualquer outro erro do
  npm (falha o job), para não publicar às cegas.
- Secret `NPM_TOKEN`: token granular do npm com Read and write no escopo do pacote
  (`@solaria.network`). A conta precisa ser owner/membro da organização do escopo; se a
  conta tiver 2FA para publicação, o token granular precisa ignorar o 2FA.
- `--provenance` exige `permissions: id-token: write` e que `repository.url` do
  `package.json` aponte para o repositório que roda o workflow.
- Ao primeiro merge na `main` o workflow publica a versão que estiver no `package.json`.
- Usado pelo `lib-web`, cujo repositório hoje se chama `web-lib`: `repository.url` precisa ter o **nome atual** do repositório, não um nome antigo que o GitHub redireciona. Com o nome antigo o npm responde `422 Error verifying sigstore provenance bundle: Failed to validate repository information`.
- Erros vistos na primeira publicação, em ordem: `403 ... bypass 2fa enabled is required` (token granular sem a opção de bypass de 2FA) e `422` do provenance (`repository.url`). Resolvidos os dois, `@solaria.network/web-lib@0.3.0` foi publicado em 2026-10-01 com provenance.
- O registro pode devolver 404 por alguns minutos depois do `+ pacote@versão` do `npm publish`.
- O npm recomenda Trusted Publishing (OIDC, sem token) para CI; exige configurar o publisher nas settings do pacote (organização, repositório e nome do arquivo do workflow) e pode exigir a primeira versão publicada manualmente.
