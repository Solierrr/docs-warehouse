# github/repository-settings.md

Padrão de configuração dos repositórios da organização. Vale para todo repositório novo e é a referência para auditar os existentes. Os repositórios `elos-*` estão fora do padrão.

## Prefixos

O prefixo do nome diz a stack, e o template de pull request, os workflows e os topics seguem o prefixo.

| Prefixo | O que é | Template de PR | Workflows |
|---|---|---|---|
| `api-` | Serviço HTTP | [`backend.md`](pull_request/backend.md) | `java/`, `kotlin/springboot/`, `python/` ou `typescript/` |
| `ai-` | Serviço de IA | [`ai.md`](pull_request/ai.md) | `python/` |
| `web-` | Aplicação web | [`frontend.md`](pull_request/frontend.md) | `typescript/` |
| `mobile-` | Aplicativo móvel | [`mobile.md`](pull_request/mobile.md) | `kotlin/jetpack-compose/` |
| `lib-` | Biblioteca publicada | [`lib.md`](pull_request/lib.md) | `python/` ou `typescript/` (`ci-library.yml`) |
| `mcp-` | Servidor MCP | [`backend.md`](pull_request/backend.md) | `python/` |
| `database-` | Schemas, migrações e cargas | [`database.md`](pull_request/database.md) | `sql/` e `python/` |
| `databricks-` | Sincronização e análise no Databricks | [`infra.md`](pull_request/infra.md) | `python/` |
| `infra-` | Infraestrutura e ferramentas | [`infra.md`](pull_request/infra.md) | `terraform/`, `kubernetes/`, `shell/`, `powershell/` ou `typescript/` |
| `docs-` | Documentação e arquivos | [`infra.md`](pull_request/infra.md) | nenhum |

`google-registry` segue o prefixo `api-` (serviço Python).

## Configuração do repositório

| Opção | Valor |
|---|---|
| Merge commit | desligado |
| Rebase merge | desligado |
| Squash merge | ligado, com título da PR e mensagens dos commits |
| Apagar branch após o merge | ligado |
| Auto-merge | ligado |
| Atualizar a branch da PR | ligado |
| Issues e Projects | ligados |
| Wiki e Discussions | desligados |
| Licença | Apache-2.0 |

O release semântico depende de um commit por PR, por isso só o squash fica liberado.

## Rulesets

Os modelos estão em [`rulesets/`](rulesets/).

- `main-protection.json`: para repositórios de código. Exige PR com 1 aprovação e revisão de code owner, só squash, bloqueia exclusão e force push, e exige os checks `quality` e `test`.
- `main-protection-without-checks.json`: o mesmo, sem checks obrigatórios. Para repositórios `docs-`, templates e repositórios que ainda não têm CI.
- `qa-protection.json`: para repositórios que têm a branch `qa`.
- `code-quality-copilot.json`: revisão do Copilot na branch padrão. Vale para todos.

O bypass é só para `OrganizationAdmin`.

## Checks obrigatórios

Todo repositório de código tem `ci.yml` com um job `test` e `quality.yml` com um job `quality`. Onde não há testes de unidade, `test` valida o que existe: compila os fontes, faz o build, renderiza os manifestos ou aplica o schema em um banco de teste. Os modelos de cada stack estão em [`workflow/`](workflow/).

## Metadados

- Descrição curta em português, no formato "o que o repositório faz".
- Topics: o tipo (`api`, `ai`, `web`, `infra`, `database`, `databricks`, `lib`), a tecnologia e, quando há deploy, `prod` e `qa`.
- `CODEOWNERS` com o responsável pelo repositório.
- `release-please` com versão base `0.0.0` quando o repositório ainda não foi publicado.

## Branch `qa`

Só existe em serviço com ambiente `qa` (deploy no Render). Bibliotecas, jobs e templates não têm `qa` nem o workflow `qa-sync.yml`.
