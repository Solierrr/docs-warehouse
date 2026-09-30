# github/dependabot/

Modelo de `.github/dependabot.yml` e do workflow que estrutura as PRs do
Dependabot. Implantado em todos os repositórios não arquivados da org (exceto
`elos-*` e o próprio `docs-warehouse`, que só guarda modelos) em 2026-09-30.

| Arquivo | Onde vai no repositório |
|---|---|
| `dependabot.yml` | `.github/dependabot.yml` (manter só os ecossistemas usados) |
| `../workflow/common/dependabot-pr-check.yml` | `.github/workflows/dependabot-pr-check.yml` |
| `../workflow/common/pr-welcome.yml` | `.github/workflows/pr-welcome.yml` (já ignora o Dependabot) |

## Regras do modelo (poucas PRs, só quando necessário)

- **Semanal**, segunda-feira 06:00 (`America/Sao_Paulo`).
- **Uma PR por ecossistema** (`open-pull-requests-limit: 1`) com todas as
  atualizações agrupadas (`groups` com `patterns: ["*"]`). Vários diretórios do
  mesmo ecossistema usam `directories` e continuam numa PR só.
- **Só minor e patch.** Versões major são ignoradas (`ignore` em
  `version-update:semver-major`) para não gerar PR de mudança incompatível sem
  ninguém ter pedido; para adotar uma major, atualize à mão ou remova a regra
  daquele repo. No `docker` só patch entra (também ignora minor), porque subir a
  minor da imagem base (ex.: `python:3.11` → `3.12`) muda a runtime.
- **`cooldown: default-days: 7`**: uma versão só é proposta depois de 7 dias
  publicada, o que filtra releases quebradas ou comprometidas.
- Ecossistemas cobertos: `github-actions`, `npm`, `pip` (requirements e
  pyproject), `maven`, `gradle`, `docker`, `terraform`. Repos sem manifesto
  (`infra-gitops`, `infra-otel-collector` etc.) ficam só com `github-actions`.

## Título da PR e o lint

O `pr-title-lint` aceita apenas `tipo: mensagem`, **sem escopo**; então
`chore(deps):` (padrão do Dependabot com `include: scope`) seria reprovado. Por
isso o `commit-message.prefix` é usado sem escopo, por ecossistema:

| Ecossistema | Prefixo | Exemplo de título |
|---|---|---|
| `github-actions` | `ci` | `ci: bump the github-actions group with 3 updates` |
| `docker` | `build` | `build: bump the docker-images group with 1 update` |
| demais | `chore` | `chore: bump the python-dependencies group with 5 updates` |

## Estrutura do corpo da PR

O Dependabot não permite template de corpo. O workflow reutilizável
`Solierrr/.github/.github/workflows/dependabot-pr.yml` (chamado por
`dependabot-pr-check.yml` em `pull_request_target`, só quando o ator é
`dependabot[bot]`) reescreve o corpo com `## Objetivo`, `## Alterações` (tabela
dependência / de / para / tipo, via `dependabot/fetch-metadata`), `## Recursos
impactados`, `## Rollback` e `## Como validar`, e guarda o texto original em um
`<details>`. Um marcador `<!-- dependabot-structured -->` evita reescrever de
novo; se o Dependabot sobrescrever o corpo num rebase, o marcador some e o
workflow estrutura outra vez.

Segurança: por usar `pull_request_target` (token com escrita), o workflow **não
faz checkout** de código da PR e só edita o corpo.

## Armadilhas

- `dependabot-pr-check.yml` só funciona depois que o `dependabot-pr.yml` central
  está na `main` do `.github`.
- Em PRs do Dependabot o `GITHUB_TOKEN` é somente leitura; por isso o
  `pr-welcome.yml` ganhou `if: github.actor != 'dependabot[bot]'`.
- Alertas e Dependabot security updates (configurações do repo) **não** foram
  ligados: security updates abrem uma PR por dependência vulnerável assim que
  ativados. Se ligar, considere `groups` com `applies-to: security-updates`.
