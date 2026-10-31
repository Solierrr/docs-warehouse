# Checklist: `ai-assistant`

Tipo `agente`. Repositório de origem em https://github.com/Solierrr/ai-assistant (só leitura). A documentação é escrita em `readme/repositories/ai-assistant/` deste repositório, numa branch `docs/ai-assistant`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/API.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/CONFLUENCE_GAP.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/HOW_IT_WORKS.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/LOCAL_SETUP.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/WORKFLOW.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: assistente principal (LangGraph, guardrails, memória, roteador, especialistas, juiz).
- Dados e externos: Mongo (checkpoints e memória), Qdrant `solaria-faq`, Redis Upstash dos agentes, provedores LLM pela `lib-ai`, LangSmith.
- Chama: `mcp-database`, `api-messenger`, `api-core`, `ai-operational` (A2A, `A2A_OPERATIONAL_URL`), `api-auth`.
- Chamado por: `ai-geographic` (A2A) e `web-sandbox`.
- Ambientes: QA ✅ (runtime python com `render-entrypoint.sh`); PROD ✅.
- Padronização ([ai-assistant#120](https://github.com/Solierrr/ai-assistant/pull/120), aguardando revisão): Swagger em `/docs`, contrato em `/openapi.json`, erros em `ProblemDetail`, `outcome` e `reason` no `/chat`, `/health` e `/ready` (Mongo), `X-Service-Key` ao `mcp-database`; o `mock-idp` saiu.
- Lacunas: o chatbot do `web-app` (`ChatbotPage`) ainda usa dados mock, então nenhum usuário chega ao assistente; `qa` e `main` sem ancestral comum (a comparação do GitHub falha), reconciliar antes de promover.

## Checklist

- [ ] Branch `docs/ai-assistant` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `fastapi` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `CHAT_TURN.md`, `DELEGATION_A2A.md`, `GUARDRAILS.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento MONGO (checkpoints e memória), QDRANT (solaria-faq), REDIS (agentes).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the ai-assistant repository` aberta para a `main`, sem merge, e o link enviado ao dono.
