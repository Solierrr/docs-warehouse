<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/openai.png" width="100" hspace="8" alt="OpenAI" title="OpenAI">
</p>

# Configuração e uso

## Configuração

As chaves vêm do ambiente (na plataforma, do Infisical), uma por provedor:

| Variável | Uso |
|---|---|
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` | Chave de cada provedor (também `<PROVEDOR>_API_KEY_2` a `_9` e `<PROVEDOR>_API_KEYS`, separadas por vírgula) |
| `LLM_PROVIDER_ORDER` | Ordem de uso e de fallback entre provedores, por exemplo `gemini,groq,openai` |
| `LLM_MODEL_OPENAI` | Modelo do provedor OpenAI (obrigatório para usá-lo) |

Sem chave para o provedor pedido, a chamada falha com `RegistryKeysNotConfigured`.

## Uso

```python
from ai_lib.llm import get_chat_model, get_chat_model_with_fallback

llm = get_chat_model_with_fallback()
llm.invoke("olá")

groq = get_chat_model("groq", model="openai/gpt-oss-120b")
structured = get_chat_model("gemini", purpose="vision").with_structured_output(MySchema)
```

Cada chamada pede uma chave, reporta `ok`, `rate_limited` ou `invalid` ao `EnvKeyClient` e, em 429, repete com outra chave (`exclude`). `bind_tools` e `with_structured_output` funcionam como no LangChain.

### Guardrail

```python
from ai_lib.guardrails import (
    build_input_prompt,
    build_judge_prompt,
    build_output_prompt,
    make_input_guardrail_node,
    make_judge_node,
    make_output_guardrail_node,
)

input_node = make_input_guardrail_node(prompt=build_input_prompt("Solaria", "energia solar"))
output_node = make_output_guardrail_node(prompt=build_output_prompt("Solaria", "energia solar"))
judge_node = make_judge_node(prompt=build_judge_prompt("Solaria", "energia solar"))
```

O estado do grafo estende `ai_lib.guardrails.GuardrailState`. Serviço com necessidade específica passa o próprio prompt (string com `{mensagem}` ou `{resposta}`) ou mantém o nó próprio.
