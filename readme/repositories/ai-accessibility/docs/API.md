<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# API

`GET /health` informa se chave do provedor e token interno estão configurados. `POST /v1/images/analyze` exige `Authorization: Bearer <INTERNAL_API_TOKEN>` e formulário com `image`, `purpose` e, opcionalmente, `request_id`, `context_title` e `max_alt_chars` (qualquer inteiro positivo; padrão 150). A legenda é gerada em pt-BR. O Swagger local fica em `/docs`.

Configure a chave Gemini em `GEMINI_API_KEY` (a mesma dos demais serviços; `GEMINI_AI_ACCESSIBILITY_KEY` e `GOOGLE_API_KEY` ainda funcionam como nomes legados, nessa ordem de prioridade). `GROQ_API_KEY` (ou o legado `GROQ_AI_ACCESSIBILITY_KEY`) ativa o GroqCloud como fallback em falhas técnicas. Com `GROQ_MODEL` vazio, usa `qwen/qwen3.8-27b`. GroqCloud e xAI/Grok são serviços diferentes.

Uma aprovação é apenas um resultado da análise. O backend que futuramente receberá o upload deve manter o arquivo privado até o autor confirmar o texto alternativo e o sistema concluir a publicação.

Na resposta, `risk_categories` lista categorias de risco identificadas. Lista vazia junto de `PROVIDER_UNAVAILABLE` não comprova que a imagem seja segura.

<!-- pr de teste dos comentarios automaticos, pode reverter -->

<!-- pr de teste dos comentarios automaticos, pode reverter -->

<!-- pr de teste dos comentarios automaticos, pode reverter -->

<!-- pr de teste dos comentarios automaticos, pode reverter -->

<!-- pr de teste dos comentarios automaticos, pode reverter -->
<!-- pr de teste para validar os comentarios do piloto de sync e release -->
