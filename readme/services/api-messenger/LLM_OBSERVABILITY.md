<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Telemetria do pipeline de LLM

O `ai-assistant` registra cada etapa do atendimento: uma chamada a modelo (`LLM_CALL`) ou a ferramenta (`TOOL_CALL`). Os registros ficam na coleção `llm_observability`. `LlmObservabilityService`, `LlmObservabilityRepository` e `LlmObservabilityController` não dependem das regras de mensagem. As rotas são internas e não exigem autenticação de aplicação. Ver [ACCESS.md](./ACCESS.md).

Esta telemetria descreve o uso dos modelos. A telemetria do próprio serviço (traces, métricas e logs) fica em [RUNNING.md](./RUNNING.md#health-e-telemetria).

## Ingestão

`POST /internal/observability` responde 201 com o header `Location`. O serviço ignora campos JSON desconhecidos.

| Campo | Obrigatório | Regra |
|---|---|---|
| `node` | sim | texto não vazio |
| `stepOrder` | sim | inteiro ≥ 0 |
| `stepType` | sim | `LLM_CALL` ou `TOOL_CALL` |
| `model` | sim | texto não vazio |
| `conversationId` | sim | texto não vazio |
| `tokensIn`, `tokensOut`, `tokensTotal` | sim | inteiros ≥ 0 |
| `latencyMs` | sim | número ≥ 0 |
| `status` | sim | texto livre |
| `environment` | não | `LOCAL`, `QA` ou `PROD` |
| `error` | não | texto livre |
| `timestamp` | não | o padrão é o instante do recebimento |
| `costUsd` | não | número ≥ 0. O padrão é 0.0 |

O serviço grava os valores como chegam. Ele não confere se `tokensTotal` é a soma de `tokensIn` e `tokensOut`, não recalcula o custo e não confere se a conversa existe.

## Consulta

- `GET /internal/observability/{id}` devolve um registro, ou 404.
- `GET /internal/observability` aceita no máximo um filtro entre `conversationId`, `node` e `status`, por igualdade exata. Dois ou mais filtros geram 400. Sem filtro, a rota devolve os 100 registros mais recentes por `timestamp`. Não há paginação.
