<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/langchain.png" alt="LangChain" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/qdrant.png" width="100" hspace="8" alt="Qdrant" title="Qdrant">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Arquitetura do Repositório

Os serviços de IA são aplicações Python que expõem uma API FastAPI e orquestram agentes com LangChain e LangGraph: a rota recebe a mensagem, um fluxo de trabalho decide qual agente ou ferramenta responde e o resultado volta pela API. O `ai-assistant` é o mais completo, com agentes especialistas, memória e recuperação de contexto; os demais (`ai-validation`, `ai-accessibility`, `ai-geographic` e `ai-operational`) seguem a mesma divisão em camadas, numa versão menor.

- **API:** as rotas de conversa e de saúde, os esquemas Pydantic de entrada e saída e os middlewares (autenticação e correlação) ficam em `api/`.
- **Agentes e fluxo:** `agents/` reúne o agente base, a fábrica, os componentes compartilhados e os especialistas, e `workflow/` monta o grafo do LangGraph que liga os nós e decide o próximo passo.
- **Ferramentas:** em `tools/`, e os clientes de outros serviços em `infra/` (por exemplo o `api-messenger` e o MCP do `mcp-database`). Ferramentas que gravam dados exigem confirmação antes de gravar.
- **Modelos de linguagem:** Gemini e Groq, escolhidos em `core/llm`. As chaves são lidas do ambiente (ver [segredos e variáveis](../infisical/README.md)).
- **Memória e contexto:** o checkpointer do LangGraph usa o MongoDB, o Redis serve de cache e de fila, e a recuperação de contexto (RAG) usa o Qdrant.
- **Guardrails e observabilidade:** `core/guardrails` valida entrada e saída, e as chamadas são rastreadas no LangSmith, com métricas de tokens, custo e latência.

## Estrutura típica

```text
├── .github/
├── docs/
├── src/
│   ├── agents/            base, factory, shared e specialist
│   ├── api/               app, middleware, routes e schemas
│   ├── core/              config, guardrails, llm, logging, observability e security
│   ├── infra/             clientes de api_messenger, cache, database, mcp e messaging
│   ├── memory/
│   ├── rag/
│   ├── tools/
│   └── workflow/          grafo do LangGraph
├── tests/
├── Dockerfile
├── Makefile
├── main.py
├── openapi.yaml
├── requirements.txt
└── README.md
```

Os serviços menores têm só parte dessas pastas.

## Veja também

- [Como rodar um serviço Python](../running/PYTHON.md)
- [Segredos e variáveis](../infisical/README.md)
- [Deploy de QA](../deploy/QA_RENDER.md)
