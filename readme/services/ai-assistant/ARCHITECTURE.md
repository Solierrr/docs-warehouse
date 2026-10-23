<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/qdrant.png" width="100" hspace="8" alt="Qdrant" title="Qdrant">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Arquitetura do Repositório

O `ai-assistant` é uma API FastAPI que expõe o assistente virtual da plataforma. Cada mensagem passa por um grafo do LangGraph: guardrails de entrada, recuperação da memória, roteamento para um ou mais agentes especialistas, consolidação da resposta e guardrails de saída. O serviço é multiagente, guarda o estado das conversas, busca contexto em uma base vetorial e delega a outros assistentes da plataforma, por A2A, os pedidos que fogem do seu papel.

- **Fluxo (`workflow/`):** o grafo do LangGraph define a ordem das etapas e decide qual especialista atende cada pedido.
- **Agentes (`agents/`):** agente base, fábrica de agentes, componentes compartilhados e especialistas de domínio.
- **Delegação (`a2a/`):** encaminha pedidos ao `ai-operational` e ao `ai-geographic` pelo protocolo Agent2Agent, repassando a identidade do usuário.
- **Memória (`memory/`) e contexto (`rag/`):** o checkpointer do LangGraph usa o MongoDB, o Redis serve de cache e de fila de agentes, e o Qdrant guarda a base de busca de contexto.
- **Ferramentas (`tools/`) e integrações (`infra/`):** consultas ao `mcp-database`, gravação de mensagens e de observabilidade no `api-messenger` e clientes de cache, banco e mensageria.
- **Núcleo (`core/`):** configuração, guardrails, seleção de modelos (Gemini e Groq), logs, observabilidade com LangSmith e validação do JWT do `api-auth`.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── scripts/dev/
├── src/
│   ├── a2a/
│   ├── agents/
│   ├── api/
│   ├── core/
│   ├── infra/
│   ├── memory/
│   ├── rag/
│   ├── tools/
│   └── workflow/
├── tests/
├── Dockerfile
├── Makefile
├── main.py
├── openapi.yaml
├── requirements.txt
└── README.md
```
