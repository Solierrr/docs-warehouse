<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/openai.png" width="100" hspace="8" alt="OpenAI" title="OpenAI">
</p>

# Biblioteca compartilhada de IA

[![License](https://img.shields.io/github/license/Solierrr/lib-ai)](https://github.com/Solierrr/lib-ai/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/lib-ai)](https://github.com/Solierrr/lib-ai/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/lib-ai)](https://github.com/Solierrr/lib-ai/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/lib-ai)](https://github.com/Solierrr/lib-ai/releases)

Esta biblioteca reúne os blocos de código que os serviços de inteligência artificial da plataforma compartilham, para que cada serviço não precise reescrever as mesmas peças. Ela cuida, por exemplo, de alternar o uso das chaves dos modelos de linguagem, de proteger dados pessoais e barrar instruções maliciosas nas conversas, de medir custo e tempo de cada resposta e de permitir que um assistente peça ajuda a outro. É publicada como pacote Python para ser instalada pelos serviços.

## Detalhes técnicos

Blocos compartilhados dos serviços de IA da plataforma. Publicado no PyPI como `solaria-lib`; o import é `ai_lib`. Requer Python 3.14 ou superior.

```bash
pip install solaria-lib
pip install "solaria-lib[a2a]"   # para usar ai_lib.a2a
```

## O que tem

| Módulo | Conteúdo |
|---|---|
| `ai_lib.registry` | Tipos e erros das chaves de LLM (`KeyLease`, `Provider`, `RegistryKeysNotConfigured`...); o nome é herança da época em que as chaves vinham do `google-registry` |
| `ai_lib.llm` | Chat model LangChain que pega uma chave do ambiente a cada chamada (`EnvKeyClient`, com rodízio e descanso em 429), `LeasedEmbeddings`, tabela de preços |
| `ai_lib.guardrails` | Anonimização de PII, detecção de injection, parsers de veredito e nós LangGraph de entrada, saída e juiz |
| `ai_lib.security` | `decode_user_id` (JWT RS256 via JWKS) |
| `ai_lib.observability` | `StepTracker`, callback LangChain que mede custo, tokens e latência |
| `ai_lib.a2a` | Agent2Agent 1.0 (extra `a2a`): `build_agent_card`, `TurnExecutor` e `mount_a2a` para receber delegações, `delegate` para delegar repassando o JWT do usuário e a persona |

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

## Desenvolvimento

```bash
uv sync --frozen --extra dev   # ou: pip install -e ".[dev]"
ruff check . && ruff format --check .
pytest
```

Commits seguem `tipo: mensagem` (inglês, minúsculo). O versionamento é feito pelo `release-please`; o comando `/release` na PR de release publica no GitHub e o `publish.yml` envia ao PyPI por Trusted Publishing (ambiente `pypi`).
