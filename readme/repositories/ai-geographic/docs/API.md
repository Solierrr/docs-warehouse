<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# API

As chamadas a `/chat` exigem `Authorization: Bearer <token>`. O [contrato](https://github.com/Solierrr/ai-geographic/blob/main/openapi.yaml) é exportado por `make openapi`. A interface `/docs` depende de `DOCS_ENABLED`.

| Grupo | Uso |
|---|---|
| `POST /chat` | Executa um turno e retorna resposta, resultado e especialistas usados |
| `GET /health` e `GET /ready` | Liveness e readiness públicos |
| `POST /debug/chat` | Depuração administrativa fora do contrato público |

O debug exige um administrador autorizado por `DEBUG_ADMIN_SUBS`. Um turno normal de debug grava histórico no serviço de mensagens, sem atualizar fatos de longo prazo. O replay personalizado de um nó não persiste alterações.

```http
POST /chat
Authorization: Bearer <token>
Content-Type: application/json

{"conversation_id":"visita-local","message":"Quais condições devo verificar antes da visita?"}
```

Erros HTTP usam o [padrão de erros](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). Uma resposta 200 pode indicar `REFUSED`, `DEGRADED` ou `TOOL_FAILED`, acompanhada de `reason`. O cliente precisa avaliar esses campos, além do status HTTP.
