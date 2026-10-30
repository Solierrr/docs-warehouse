<p align="center">
  <img src="../assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

# Interface da biblioteca

A interface é Python. O suporte A2A monta um protocolo no servidor consumidor. Não há contrato OpenAPI próprio na distribuição.

## Chat e embeddings

`ai_lib.llm` exporta as funções de modelos. O consumidor prepara o ambiente antes da primeira seleção de credenciais.

```python
from ai_lib.llm import get_chat_model_from_env

model = get_chat_model_from_env()
response = model.invoke("Explique como organizar uma visita técnica.")
```

`get_chat_model` escolhe um provedor. `get_chat_model_with_fallback` monta primário e alternativo. `get_chat_model_from_env` monta a sequência do ambiente. O modelo aceita chamadas síncronas e assíncronas, `bind_tools` e `with_structured_output`. `LeasedEmbeddings` fornece vetores de consultas e documentos.

## Revisão e identidade

As fábricas `make_input_guardrail_node`, `make_output_guardrail_node` e `make_judge_node` recebem prompt e modelo opcional. O estado estende `GuardrailState`. O consumidor conecta `route` e `judge_status` ao grafo. Bloquear entrada remove a última mensagem e inclui a resposta configurada.

`decode_user_id(token, jwks_url=..., issuer=...)` retorna o identificador ou `None`. A autorização permanece no consumidor.

## Delegação opcional

O extra `a2a` fornece `build_agent_card`, `mount_a2a`, `TurnExecutor` e `delegate`. O Agent Card fica em `/.well-known/agent-card.json` e o JSON-RPC em `/a2a`, salvo caminho personalizado.

`delegate` recebe texto, token, persona e contexto opcional. O retorno contém `outcome`, `text`, `task_id` e `context_id`. Reutilizar o contexto continua a conversa. O timeout padrão é 120 segundos. Quando fornece seu próprio cliente HTTP, o consumidor também configura seus cabeçalhos.

`TurnExecutor` cria um `TurnRequest`. A resposta com `needs_input` exige entrada. A outra resposta conclui a tarefa. Exceção marca falha e cancelamento marca a tarefa cancelada, sem desfazer operações de negócio já executadas.

## Falhas

Limite de requisições e credencial inválida permitem nova chave, até três tentativas por padrão. Outras exceções seguem ao chamador. `DelegationError` representa erro de comunicação ou resposta sem tarefa. O A2A usa seus próprios estados e erros. O consumidor implementa o [contrato HTTP de erros](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md).

As fontes são [chat](https://github.com/Solierrr/lib-ai/blob/main/src/ai_lib/llm/chat.py), [revisão](https://github.com/Solierrr/lib-ai/blob/main/src/ai_lib/guardrails/nodes.py), [cliente A2A](https://github.com/Solierrr/lib-ai/blob/main/src/ai_lib/a2a/client.py) e [executor](https://github.com/Solierrr/lib-ai/blob/main/src/ai_lib/a2a/executor.py).
