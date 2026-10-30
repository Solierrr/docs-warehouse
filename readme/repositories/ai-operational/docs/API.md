<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# API e delegação

O contrato HTTP está no [`openapi.yaml`](https://github.com/Solierrr/ai-operational/blob/main/openapi.yaml). O [Swagger de QA](https://ai-operational.onrender.com/docs) e `/openapi.json` ficam expostos quando `DOCS_ENABLED` permite. O A2A e o debug ficam fora desse contrato.

## Autenticação

`POST /chat` recebe `Authorization: Bearer <access-token>` do `api-auth`. O serviço valida assinatura RS256, expiração, identificador da pessoa e emissor configurado. Tokens de refresh são recusados. Fora de `LOCAL`, ausência da configuração JWKS responde 503. A conversa com dono diferente responde 403 quando o dono é identificado.

As chamadas ao `api-core` usam esse mesmo JWT. Respostas e registros internos enviados ao `api-messenger` usam `X-Service-Key` com a chave do serviço.

## Grupos de operações

Cada grupo atende um tipo de consumidor.

| Grupo | Caminho | Uso |
|---|---|---|
| Conversa | `POST /chat` | mensagem e resposta síncrona de um turno |
| Saúde | `GET /health`, `GET /ready` | processo e prontidão, sem autenticação |
| Delegação | `/.well-known/agent-card.json` e transporte A2A montado pela biblioteca | descoberta e tarefas do assistente principal |
| Debug | `POST /debug/chat` | turno inspecionável ou replay de um nó, para administradores autorizados |

O cliente escolhe `conversation_id` e reutiliza o mesmo identificador para continuar o contexto e decidir sobre uma proposta. A resposta traz `response`, `outcome`, `reason`, `specialists_used` e `workflow_steps`. O HTTP 200 pode conter recusa ou falha de ação, por isso o consumidor deve avaliar `outcome`.

| `outcome` | Significado |
|---|---|
| `ANSWERED` | resposta sem marca de falha reconhecida |
| `REFUSED` | recusa do guardrail ou do juiz |
| `DEGRADED` | avaliação indisponível ou resposta degradada marcada pelo fluxo |
| `TOOL_FAILED` | preparação ou execução da ação falhou |

Os motivos incluem `OUT_OF_SCOPE`, `MANIPULATION_ATTEMPT`, `INTERNAL_DATA_REQUEST`, `FALSE_INFORMATION`, `GUARDRAIL_REFUSED`, `GUARDRAIL_UNAVAILABLE`, `ANSWER_REJECTED` e `ACTION_FAILED`. Eles existem no código, mas ainda não constam na seção de agentes do [catálogo central](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERROR_CODES.md). A manutenção desse catálogo precisa ser definida. <!-- PENDENTE: 4 -->

## Exemplo de conversa

A mensagem abaixo consulta orientação e não propõe alteração.

```http
POST /chat HTTP/1.1
Host: localhost:8000
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "conversation_id": "orientacao-ofertas",
  "message": "Onde cadastro uma oferta de placa?"
}
```

Para aceitar uma proposta já recebida, envie outra mensagem na mesma conversa. Esse pedido pode gravar dados no cadastro central.

```http
POST /chat HTTP/1.1
Host: localhost:8000
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "conversation_id": "orientacao-ofertas",
  "message": "sim"
}
```

O aceite só executa quando há proposta válida. Para encerramento de oferta ou cancelamento de pedido, use "confirmo". O protocolo está no [fluxo de aprovação](../flows/ACTION_APPROVAL.md).

## A2A

O Agent Card descreve a skill `operar-saas` e anuncia `A2A_PUBLIC_URL`. O adaptador recebe texto, token e identificador da conversa em `TurnRequest`, valida o token e chama o mesmo runner do chat. `TurnReply.needs_input` fica verdadeiro enquanto há proposta pendente e a biblioteca traduz esse resultado para `input_required`.

O consumidor deve descobrir o transporte pelo Agent Card e preservar o contexto ao enviar a decisão. O handler devolve texto orientando login para token ausente ou inválido e texto de recusa para conversa de outra pessoa. Essas respostas não usam o contrato HTTP do chat. O percurso externo está em [ASSISTANT_CHAT.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/ASSISTANT_CHAT.md), com a diferença atual de acesso aos dados registrada na pendência 4.

## Debug

O debug fica fora do Swagger. `DEBUG_ADMIN_SUBS` deve conter UUIDs válidos e `ENVIRONMENT` deve ser `LOCAL`, `DEV`, `QA` ou `PROD`. Sem isso, a resposta é 404. Token ausente ou inválido recebe 401, e pessoa fora da lista recebe 403.

O turno normal de debug simula gravações no `api-core` e não lê nem atualiza fatos duráveis, mas grava conversa, mensagens e etapas no `api-messenger`. Seu checkpoint tem namespace próprio. O corpo pode incluir `custom` para reexecutar um nó de turno anterior com substituição de mensagens de sistema. Esse replay usa uma cópia temporária do checkpoint e não salva histórico remoto. As leituras de dados e chamadas de LLM continuam reais.

O bloco `debug` mostra nós, prompts, chamadas e durações, com mascaramento por padrões. `prompt_complete` falso impede usar o prompt mascarado como substituto do original. Turno, nó ou ocorrência ausente produz 404. Reconstrução impossível produz 409, e entrada inválida produz 422. A implementação está em [`routes/debug.py`](https://github.com/Solierrr/ai-operational/blob/main/src/api/routes/debug.py).

## Erros

O chat usa `application/problem+json` com os campos do [contrato de erro](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). Os códigos principais são `UNAUTHENTICATED` em 401, `FORBIDDEN` em 403, `VALIDATION_FAILED` em 422, `DEPENDENCY_UNAVAILABLE` em 503 e `INTERNAL_ERROR` em 500.

O 503 de `/ready` mantém JSON com `status` igual a `DOWN`. Falhas capturadas pelo handler de debug podem devolver `detail` e o diagnóstico parcial, fora do envelope padronizado. A diferença está em [STATUS.md](./STATUS.md).
