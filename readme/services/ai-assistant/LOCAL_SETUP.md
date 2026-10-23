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

# Configuração e execução local

## Variáveis de ambiente

As chaves e URLs vêm do Infisical (`make vault ENV=local|qa|prod`, pastas `/database /redis /llm /agent-queue`). O [.env.example](https://github.com/Solierrr/ai-assistant/blob/main/.env.example) lista todas. As principais:

| Variável | Uso |
|---|---|
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`, `LLM_PROVIDER_ORDER`, `LLM_MODEL_OPENAI` | LLM |
| `MONGODB_URI` | Checkpointer e memória de longo prazo |
| `API_MESSENGER_URL` | Conversas e mensagens |
| `UPSTASH_REDIS_*` | Redis dos agentes |
| `JWT_JWKS_URL`, `JWT_ISSUER` | Validação do JWT do usuário (RS256, emitido pelo `api-auth`) |
| `MCP_URL`, `MCP_API_KEY` | `mcp-database` |
| `API_CORE_URL` | Unidades do usuário |
| `A2A_PUBLIC_URL`, `A2A_OPERATIONAL_URL` | Agent Card e destino da delegação de ações |
| `QDRANT_URL`, `QDRANT_API_KEY` | RAG do FAQ |
| `SOLARIA_LANGSMITH_*` | Rastreamento no LangSmith (opcional) |
| `ENVIRONMENT` | `LOCAL` (padrão), `QA` ou `PROD` |
| `DEBUG_ADMIN_SUBS` | Modo debug (`POST /debug/chat`): UUIDs (`sub` do JWT) dos admins, separados por vírgula; vazio fecha a rota (inclusive em `PROD`) |

## Como rodar

```bash
make install            # cria o .venv e instala as dependências
make vault ENV=local    # grava o .env a partir do Infisical
make dev                # uvicorn src.api.app:app --reload
make test               # pytest com cobertura
make lint
```

Para conversar pelo terminal sem a API, defina `TEST_USER_TOKEN` (um JWT do `api-auth` ou do mock-idp em `scripts/dev/mock_idp`) e rode `python main.py`.
