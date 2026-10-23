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

# Endpoints

| Rota | Uso |
|---|---|
| `POST /chat` | Recebe `{conversation_id, message}` com `Authorization: Bearer <JWT>` e devolve `{response, specialists_used, workflow_steps, messenger_conversation_id}` |
| `POST /debug/chat` | Só interno, fora do OpenAPI, só para os admins de `DEBUG_ADMIN_SUBS` (inclusive em PROD): o mesmo corpo do `/chat` mais `persona`, e devolve também o `debug` com a entrada e a saída de cada nó. Ver [docs/debug-endpoint.md](https://github.com/Solierrr/ai-assistant/blob/main/docs/debug-endpoint.md) |
| `GET /health` | Estado do serviço e das chaves de LLM que faltam |
| `GET /.well-known/agent-card.json` | Agent Card A2A (habilidade `recomendar-produtos`) |
| `POST /a2a` | JSON-RPC do A2A 1.0; exige o mesmo `Authorization: Bearer`; a persona (`demandante` ou `profissional`) vai em `message.metadata` |

O [openapi.yaml](https://github.com/Solierrr/ai-assistant/blob/main/openapi.yaml) descreve `POST /chat` e `GET /health`; ele não cobre o A2A.
