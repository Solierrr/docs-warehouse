<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/qdrant.png" width="100" hspace="8" alt="Qdrant" title="Qdrant">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Como o assistente funciona

## Detalhes técnicos

Assistente de IA da plataforma para o **demandante** na web: ajuda a encontrar as melhores placas solares e itens de fixação para o contexto dele, e os profissionais e empresas que se encaixam, e repassa ao `ai-operational` os pedidos de ação no SaaS. É um grafo LangGraph atrás de uma API FastAPI, com guardrails de entrada e saída, memória de conversa e de longo prazo, e ferramentas por MCP. Outros agentes (o `ai-geographic`, no mobile) também o consultam por A2A.

Fora do escopo dele, por decisão de arquitetura: operar telas do SaaS (é do `ai-operational`) e geografia, clima e rotas (é do `ai-geographic`). Ver o [documento 12](https://github.com/Megueutu/VersioSpec/blob/main/projects/solaria/entrega/12-arquitetura-dos-agentes-de-ia-2026-10-18.md) do VersioSpec.

## Como uma mensagem é tratada

```
input_guardrail → condense_memory → router ─┬→ faq_reader ─────────┐
                                            ├→ professional_suggester ┤
                                            ├→ agency_suggester ──────┤  voltam ao router,
                                            ├→ solar_panel_specialist ┤  que decide se já basta
                                            ├→ solar_calculator ──────┘
                                            ├→ operational_delegate ──→ fim (resposta vai direto ao usuário)
                                            └→ orchestrator → judge → output_guardrail → fim
```

| Etapa | O que faz |
|---|---|
| `input_guardrail` | Regex de injeção e de dados internos, anonimiza PII (CNPJ, CPF, telefone, e-mail) e classifica a mensagem por LLM; bloqueia o que não é permitido |
| `condense_memory` | Resume a conversa quando ela cresce |
| `router` | Escolhe um especialista por vez, ou o orquestrador quando já há informação suficiente; com uma decisão pendente do agente operacional, devolve a mensagem direto a ele |
| `faq_reader` | Responde sobre a plataforma com RAG no Qdrant (coleção `solaria-faq`) |
| `solar_panel_specialist` | Conteúdo técnico, recomendação de placas (`recomendar_ofertas`) e de itens de fixação (`listar_itens_de_fixacao`) |
| `professional_suggester` | Recomenda profissionais (`recomendar_profissionais`, `listar_profissoes`, `buscar_tecnicos_credenciados`) |
| `agency_suggester` | Recomenda empresas fornecedoras (`recomendar_fornecedores`) |
| `solar_calculator` | Estimativa preliminar de consumo, geração, investimento e payback, pelas ferramentas do billscanner |
| `operational_delegate` | Delega ao `ai-operational` por A2A, com o JWT do usuário; a proposta volta exatamente como foi escrita |
| `orchestrator` | Compõe a resposta final a partir do que os especialistas reuniram |
| `judge` | Valida a resposta (alucinação, aderência) e pede uma nova tentativa antes de bloquear |
| `output_guardrail` | Revisão de conformidade por LLM e remoção de PII |

O ranking de placas, profissionais e empresas é determinístico e vem da `api-recommendation`; o LLM só cruza as necessidades do usuário com o top-N e explica a escolha. Para buscas por proximidade, `listar_minhas_unidades` lê as unidades do usuário no `api-core` com o JWT dele (só para a persona `demandante`).

## Memória

| Tipo | Onde | Detalhe |
|---|---|---|
| Conversa (curto prazo) | Mongo, `assessor_inteligente.checkpoints_conversas` (checkpointer do LangGraph) | Persiste entre reinícios; expira em `CHECKPOINT_TTL_DIAS` (30) |
| Mensagens e observabilidade | `api-messenger` | Cada turno grava a mensagem do usuário e a do assistente; o `messenger_conversation_id` volta no `/chat` |
| Longo prazo (fatos do usuário) | Mongo, `user_memory` | Extraído ao fim do turno, em segundo plano; limitações em [docs/long-term-memory-limitations.md](https://github.com/Solierrr/ai-assistant/blob/main/docs/long-term-memory-limitations.md) |

O JWT do usuário e a persona ficam em variáveis de contexto (`src/core/security/request_context.py`), nunca no estado do grafo, porque o checkpointer grava o estado no Mongo.

## Ferramentas (MCP e A2A)

- **MCP**, `mcp-database` (`MCP_URL`, `MCP_API_KEY`): `recomendar_ofertas`, `recomendar_profissionais`, `recomendar_fornecedores`, `listar_profissoes`, `buscar_tecnicos_credenciados`, `listar_itens_de_fixacao`. Se uma ferramenta some do servidor, o cliente avisa no log em vez de deixar o especialista mudo.
- **A2A**: serve o próprio Agent Card e recebe delegações; delega ao `ai-operational` (`A2A_OPERATIONAL_URL`). Módulo `ai_lib.a2a` da `solaria-lib`. Requisitos em [13-requisitos-mcp-e-a2a](https://github.com/Megueutu/VersioSpec/blob/main/projects/solaria/entrega/13-requisitos-mcp-e-a2a-2026-10-18.md).

## LLM

Uma chave por provedor, lidas do ambiente pela `solaria-lib` (`GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`). `LLM_PROVIDER_ORDER` define a ordem e o fallback entre provedores (por exemplo `gemini,groq,openai`); `LLM_MODEL_GEMINI`, `LLM_MODEL_GROQ` e `LLM_MODEL_OPENAI` escolhem o modelo (o da OpenAI não tem padrão). O custo por turno e a timeline aparecem em [docs/observability-cost.md](https://github.com/Solierrr/ai-assistant/blob/main/docs/observability-cost.md) e [docs/observability-langsmith.md](https://github.com/Solierrr/ai-assistant/blob/main/docs/observability-langsmith.md).
