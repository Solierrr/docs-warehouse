# Instruções de documentação

Pasta temporária. Ela orienta a documentação de todos os repositórios e é apagada quando o trabalho terminar. Os padrões permanentes ficam em [`docs/standards/`](../../docs/standards/README.md#documentação).

## Como participar

Cole no seu agente (Claude Code ou outro) o prompt que o dono passou. Ele aponta para o [`PROMPT.md`](./PROMPT.md), que faz o agente carregar o contexto, baixar os repositórios com o [`clone-repos.sh`](./clone-repos.sh), sortear um repositório livre, escrever a documentação e abrir a Pull Request.

Regras que valem para todo mundo:

- A escrita acontece só aqui no `docs-warehouse`, em `readme/repositories/<repo>/`. Os outros repositórios são só leitura.
- Uma branch `docs/<repo>` publicada assim que o trabalho começa, para reservar o repositório.
- Uma Pull Request por repositório. Ninguém faz merge, só o dono.
- Dúvidas vão para o `PENDENCIAS.md` do repositório. Ninguém pergunta a quem roda o agente.
- Commits em inglês, minúsculos, `tipo: descrição`, com a sua identidade git e sem nenhuma marca de IA.

## Repositórios

Escolha aleatória entre os que não têm branch `docs/<repo>` nem Pull Request aberta. O andamento real está nas [Pull Requests](https://github.com/Solierrr/docs-warehouse/pulls) e nas branches `docs/*`.

| Repositório | Checklist | Situação |
|---|---|---|
| `ai-accessibility` | [checklist](./checklists/ai-accessibility.md) | a fazer |
| `ai-assistant` | [checklist](./checklists/ai-assistant.md) | a fazer |
| `ai-geographic` | [checklist](./checklists/ai-geographic.md) | a fazer |
| `ai-operational` | [checklist](./checklists/ai-operational.md) | a fazer |
| `ai-validation` | [checklist](./checklists/ai-validation.md) | a fazer |
| `api-auth` | [checklist](./checklists/api-auth.md) | a fazer |
| `api-core` | [checklist](./checklists/api-core.md) | a fazer |
| `api-email` | [checklist](./checklists/api-email.md) | a fazer |
| `api-google` | [checklist](./checklists/api-google.md) | a fazer |
| `api-messenger` | [checklist](./checklists/api-messenger.md) | a fazer |
| `api-notify` | [checklist](./checklists/api-notify.md) | exemplo pronto |
| `api-recommendation` | [checklist](./checklists/api-recommendation.md) | a fazer |
| `database-bootstrap` | [checklist](./checklists/database-bootstrap.md) | a fazer |
| `database-console` | [checklist](./checklists/database-console.md) | a fazer |
| `database-rpa` | [checklist](./checklists/database-rpa.md) | a fazer |
| `databricks-stocker` | [checklist](./checklists/databricks-stocker.md) | a fazer |
| `databricks-sync` | [checklist](./checklists/databricks-sync.md) | a fazer |
| `docs-reports` | [checklist](./checklists/docs-reports.md) | a fazer |
| `infra-broker` | [checklist](./checklists/infra-broker.md) | a fazer |
| `infra-gateway` | [checklist](./checklists/infra-gateway.md) | a fazer |
| `infra-gitops` | [checklist](./checklists/infra-gitops.md) | a fazer |
| `infra-observability` | [checklist](./checklists/infra-observability.md) | a fazer |
| `infra-keepalive` | [checklist](./checklists/infra-keepalive.md) | a fazer |
| `infra-otel-collector` | [checklist](./checklists/infra-otel-collector.md) | a fazer |
| `infra-platform` | [checklist](./checklists/infra-platform.md) | a fazer |
| `infra-stress` | [checklist](./checklists/infra-stress.md) | a fazer |
| `lib-ai` | [checklist](./checklists/lib-ai.md) | a fazer |
| `lib-web` | [checklist](./checklists/lib-web.md) | a fazer |
| `mcp-database` | [checklist](./checklists/mcp-database.md) | a fazer |
| `mobile-app` | [checklist](./checklists/mobile-app.md) | a fazer |
| `mocks-warehouse` | [checklist](./checklists/mocks-warehouse.md) | a fazer |
| `web-app` | [checklist](./checklists/web-app.md) | a fazer |
| `worker-docs` | [checklist](./checklists/worker-docs.md) | a fazer |
| `web-sandbox` | [checklist](./checklists/web-sandbox.md) | a fazer |
| `worker-failover` | [checklist](./checklists/worker-failover.md) | a fazer |

Ficam fora os repositórios `elos-*`, `generic-template`, `.github` e o próprio `docs-warehouse`.
