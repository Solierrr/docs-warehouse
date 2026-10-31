<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/openai.png" width="100" hspace="8" alt="OpenAI" title="OpenAI">
</p>

# O que a biblioteca oferece

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
