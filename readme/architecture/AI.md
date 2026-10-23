<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/langchain.png" alt="LangChain" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/qdrant.png" width="100" hspace="8" alt="Qdrant" title="Qdrant">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Arquitetura de um serviço de IA

README reutilizável, usado como base do `ARCHITECTURE.md` dos serviços de IA (`ai-assistant`, `ai-validation`, `ai-accessibility`, `ai-geographic`, `ai-operational`). São serviços Python que expõem uma API FastAPI e orquestram um ou mais agentes com LangChain e LangGraph: a rota recebe a mensagem, um fluxo de trabalho decide qual agente ou ferramenta responde, e o resultado volta pela API. O que muda de um serviço para outro é o conjunto de agentes e de ferramentas; a divisão em camadas é a mesma. Escreva o documento em português, em parágrafos corridos, com no mínimo 60 palavras na introdução e quatro bullets de decisões.

## O que descrever

- **API.** As rotas (`/chat`, `/health` e as específicas do serviço), os esquemas Pydantic de entrada e saída e os middlewares (autenticação, correlação, limites).
- **Agentes e fluxo.** Quais agentes existem (base, especialistas), como o grafo do LangGraph liga cada nó, qual nó decide o próximo passo e onde o fluxo termina. Diga se há mais de um agente e como eles se coordenam.
- **Ferramentas.** O que cada ferramenta faz e a quem chama: outro serviço da plataforma, o MCP (`mcp-database`), uma API externa ou o banco vetorial. Ferramentas que gravam dados exigem confirmação antes de gravar.
- **Modelos de linguagem.** Quais provedores (Gemini, Groq, OpenAI), como o modelo é escolhido, o que acontece quando um provedor falha e como as chaves são lidas (ver [segredos e variáveis](../infisical/README.md)).
- **Memória e contexto.** Checkpointer do LangGraph (MongoDB), cache e filas (Redis) e recuperação de contexto (RAG sobre o Qdrant).
- **Guardrails.** Validações de entrada e saída, limites de tamanho e de custo, e o que o serviço recusa responder.
- **Observabilidade.** Rastreamento das chamadas no LangSmith, métricas de tokens, custo e latência, e como uma conversa é reconstruída a partir dos registros.
- **Integrações.** Com o `api-messenger` (histórico e observabilidade) e com os demais serviços de IA e de dados.

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

Serviços menores (`ai-validation`, `ai-accessibility`) têm só parte dessas pastas. Documente apenas as que existem.

## Checklist antes de abrir o Pull Request

- O diagrama do fluxo (agentes e ferramentas) corresponde ao grafo do código.
- Cada ferramenta que grava dados diz como a confirmação é pedida.
- Nenhuma chave de modelo ou de API aparece no texto.
- Limites e custos citados vêm da configuração real, não de estimativa.

## Veja também

- [Como rodar um serviço Python](../running/PYTHON.md)
- [Segredos e variáveis](../infisical/README.md), para as chaves de modelos
- [Deploy de QA](../deploy/QA_RENDER.md)
