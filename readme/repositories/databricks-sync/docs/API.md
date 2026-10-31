<p align="center">
  <img src="../assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# API de sincronização

O contrato está em [openapi.yaml](https://github.com/Solierrr/databricks-sync/blob/main/openapi.yaml). `/docs` e `/openapi.json` são expostos enquanto `DOCS_ENABLED` não for falso.

## Autenticação

Usar Bearer com o token fixo `SYNC_API_TOKEN`. O esquema chamado `bearerAuth` no contrato não significa JWT de pessoa. Health e readiness são públicos. Nenhuma rota aceita chave por chamador nesta main. <!-- PENDENTE: 2 -->

## Operações

| Operação | Resultado |
|---|---|
| `POST /sync` | 202 com id e endereço de consulta |
| `POST /sync?wait=true` | Aguarda Bronze, 200 com resumo ou 500 com `result` |
| `GET /sync/{job_id}` | Estado, progresso, resultado ou erro do job |
| `POST /sync/gold` | Aguarda exportação Gold e devolve resumo |
| `GET /health` | Processo e versão |
| `GET /ready` | 200 UP ou 503 DOWN |

## Exemplo

O comando inicia uma carga que substitui tabelas no destino. Usar somente no ambiente autorizado.

```bash
curl --request POST http://localhost:8000/sync   --header "Authorization: Bearer $SYNC_API_TOKEN"
```

Consultar `status_url` devolvida pela API com o mesmo cabeçalho até `completed` ou `failed`. Não tratar 202 como carga concluída. O histórico pode desaparecer no reinício ou por limite de 20 jobs.

## Erros

Token inválido responde 401, job ocupado 409, configuração ausente 503 e execução com erro 500. Falha com resumo inclui `result`. Job inexistente responde 404. O formato é `application/problem+json`, conforme [erros HTTP](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). `GET` de um job falho ainda responde com seu estado, sem se transformar por isso em 500.

As fontes são [rotas](https://github.com/Solierrr/databricks-sync/blob/main/app/routes/sync.py) e [autenticação](https://github.com/Solierrr/databricks-sync/blob/main/app/auth.py).
