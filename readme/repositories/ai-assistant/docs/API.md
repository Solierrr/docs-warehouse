<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# API

O [contrato HTTP](https://github.com/Solierrr/ai-assistant/blob/main/openapi.yaml) é gerado por `make openapi`. `/docs` e `/openapi.json` dependem de `DOCS_ENABLED`. `/chat` e A2A exigem JWT.

```http
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{"conversation_id":"consulta-local","message":"Quero comparar placas para meu projeto"}
```

A resposta inclui texto, `outcome`, `reason`, especialistas, etapas e `messenger_conversation_id`. Esse identificador permite avaliar a conversa no serviço de mensagens. O retorno não usa streaming.

O Agent Card fica em `/.well-known/agent-card.json` e o JSON-RPC A2A em `/a2a`. A persona é enviada nos metadados A2A. O protocolo fica fora do OpenAPI. `/debug/chat` é administrativo, fora do contrato público, e usa os administradores configurados.

Erros HTTP seguem [ERRORS.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). Resultado 200 pode indicar recusa, degradação ou falha de ferramenta. O cliente deve inspecionar `outcome` e `reason`.
