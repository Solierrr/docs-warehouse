<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastapi.png" width="100" hspace="8" alt="FastAPI" title="FastAPI">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Acessibilidade e moderação de imagens

[![License](https://img.shields.io/github/license/Solierrr/ai-accessibility)](https://github.com/Solierrr/ai-accessibility/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/ai-accessibility)](https://github.com/Solierrr/ai-accessibility/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/ai-accessibility)](https://github.com/Solierrr/ai-accessibility/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/ai-accessibility)](https://github.com/Solierrr/ai-accessibility/releases)

Este serviço analisa as imagens enviadas na plataforma antes de elas serem publicadas. Ele verifica se o conteúdo é adequado e, quando a imagem é aprovada, escreve uma descrição curta que pode ser lida por leitores de tela, ajudando pessoas com deficiência visual a entender o que a imagem mostra. O resultado informa se a imagem foi aprovada, se precisa da revisão de uma pessoa ou se foi recusada. Ele não guarda nem publica nenhuma imagem: apenas analisa e responde. Os detalhes técnicos e as instruções para testar ficam nas seções abaixo.

## Detalhes técnicos

API interna para analisar imagens enviadas à plataforma, identificar conteúdo inadequado e sugerir textos alternativos para acessibilidade

## Estado atual

O MVP aceita JPEG, PNG ou WebP por `POST /v1/images/analyze`, valida o arquivo, consulta um provedor de IA para sinais de moderação, aplica uma política determinística e, se aprovado, gera uma descrição curta. A resposta é `approved`, `review_required` ou `rejected`. O serviço não armazena nem publica a mídia.

O `web-app` ainda não tem upload conectado a esta API. Para testar agora, envie uma imagem diretamente pela rota interna. Execute localmente com `./.venv/Scripts/python.exe -m uvicorn src.api.app:app --host 127.0.0.1 --port 8080` no PowerShell.

- [AGENTS.md](https://github.com/Solierrr/ai-accessibility/blob/main/AGENTS.md): contexto do projeto, arquitetura, fluxo de análise e orientações de manutenção.

## API

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
