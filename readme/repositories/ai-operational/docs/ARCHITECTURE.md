<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Arquitetura do Repositório

Este serviço segue o mesmo padrão do `ai-assistant`: uma API FastAPI que
expõe um chatbot orquestrado via LangGraph, com guardrails de entrada/saída,
memória de curto prazo (checkpointer Mongo) e memória de longo prazo (perfil
de fatos do usuário), delegando a especialistas de domínio por meio de um
Agente Roteador. Os especialistas são o Localizador de Telas (`screen_finder`, ferramenta `buscar_tela` sobre o registro de telas em `src/domain/screens.py`), o Agente de Ações (`action_proposer`, que monta a proposta sem gravar) e o nó de decisão (`proposal_decision`, que executa no `api-core` depois do aceite). A proposta pendente fica em `pending_proposal` no estado e as respostas desses dois nós seguem direto ao usuário, sem passar pelo orquestrador, pelo juiz e pelo guardrail de saída.

- Orquestração multiagente via LangGraph (`src/workflow/graph/graph.py`):
  `input_guardrail` → `condense_memory` → `router` → especialista(s) →
  `orchestrator` → `judge` → `output_guardrail`.
- Cada especialista de domínio vive em `src/agents/specialist/<nome>/` (prompt)
  e `src/workflow/nodes/<nome>_node.py` (node).
- Integrações de infraestrutura ficam em `src/infra/` (Mongo, Redis, MCP,
  api-messenger); nenhuma delas depende do domínio específico do assistente.
- Autenticação via JWT emitido pelo `api-auth` (`src/core/security/jwt.py`).

```Tree do Repositório (resumo)
├── .github/
│   └── pull_request_template.md
├── src/
│   ├── agents/       # framework base + especialistas
│   ├── api/          # FastAPI (rotas, schemas)
│   ├── core/         # config, llm, guardrails, logging, security
│   ├── infra/        # clientes de infraestrutura (mongo, redis, mcp, api-messenger)
│   ├── memory/        # checkpointer de sessão
│   └── workflow/     # grafo LangGraph, nodes, state
├── tests/
├── README.md
├── ARCHITECTURE.md
├── RUNNING.md
├── LICENSE
└── ...
```
