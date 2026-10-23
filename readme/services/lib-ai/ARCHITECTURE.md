<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/openai.png" width="100" hspace="8" alt="OpenAI" title="OpenAI">
</p>

# Arquitetura do Repositório

O `lib-ai` é a biblioteca Python compartilhada pelos serviços de inteligência artificial da plataforma, publicada no PyPI como `solaria-lib` e importada como `ai_lib`. Cada módulo resolve uma necessidade comum a todos os serviços, para que nenhum deles reimplemente a mesma peça. A biblioteca exige Python 3.14 ou superior, e o suporte a Agent2Agent é instalado como extra opcional.

- **Chaves e modelos (`ai_lib.registry` e `ai_lib.llm`):** chat model do LangChain que escolhe uma chave do ambiente a cada chamada, com rodízio e pausa quando o provedor limita as requisições.
- **Guardrails (`ai_lib.guardrails`):** anonimização de dados pessoais, detecção de injeção de instruções e nós de entrada, saída e juiz para o LangGraph.
- **Segurança (`ai_lib.security`):** leitura do usuário a partir do JWT do `api-auth`.
- **Observabilidade (`ai_lib.observability`):** medição de custo, tokens e latência de cada etapa.
- **Agent2Agent (`ai_lib.a2a`):** recebe e faz delegações entre assistentes, repassando a identidade do usuário.
- **Gerenciamento:** dependências e build com `uv`; versão e publicação pelo release-please.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── src/
│   └── ai_lib/
├── tests/
│   ├── a2a/
│   ├── guardrails/
│   ├── llm/
│   ├── observability/
│   └── security/
├── Makefile
├── pyproject.toml
├── uv.lock
└── README.md
```
