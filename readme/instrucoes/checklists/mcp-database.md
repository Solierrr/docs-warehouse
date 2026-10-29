# Checklist: `mcp-database`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/mcp-database (só leitura). A documentação é escrita em `readme/repositories/mcp-database/` deste repositório, numa branch `docs/mcp-database`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/DEVELOPMENT.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/OVERVIEW.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: ferramentas MCP somente leitura sobre fornecedores, ofertas e técnicos.
- Dados: `coredb` (`DATABASE_URL`).
- Chama: `api-recommendation`.
- Chamado por: `ai-assistant` e `ai-operational` (`MCP_URL`, `MCP_API_KEY`; o `ai-operational` envia também `X-Service-Key` desde a [ai-operational#21](https://github.com/Solierrr/ai-operational/pull/21), aguardando revisão; o `ai-assistant` também, desde a [ai-assistant#120](https://github.com/Solierrr/ai-assistant/pull/120), aguardando revisão). Com a [mcp-database#34](https://github.com/Solierrr/mcp-database/pull/34): `X-Service-Key` (`SERVICE_KEY_AI_ASSISTANT`, `SERVICE_KEY_AI_OPERATIONAL`), com o `x-api-key` aceito só enquanto `MCP_API_KEY` existir; `/health` e `/ready` (Postgres).
- Ambientes: QA ✅; PROD ⚠️: o Terraform cria o segredo `api-mcp-secrets`, mas o `deployment.yaml` lê `mcp-database-secrets`, então o pod não encontra as variáveis.
- Lacunas: corrigir o nome do segredo de um dos lados; `qa` e `main` divergentes (main +32, qa +5).

## Checklist

- [ ] Branch `docs/mcp-database` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `mcp` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `TOOL_CALL.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` não se aplica, a menos que o código mostre um banco próprio. Nesse caso, documentar e registrar no `PENDENCIAS.md`.
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the mcp-database repository` aberta para a `main`, sem merge, e o link enviado ao dono.
