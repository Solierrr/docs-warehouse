<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Estado atual do serviço

## Detalhes técnicos

API interna para analisar imagens enviadas à plataforma, identificar conteúdo inadequado e sugerir textos alternativos para acessibilidade

## Estado atual

O MVP aceita JPEG, PNG ou WebP por `POST /v1/images/analyze`, valida o arquivo, consulta um provedor de IA para sinais de moderação, aplica uma política determinística e, se aprovado, gera uma descrição curta. A resposta é `approved`, `review_required` ou `rejected`. O serviço não armazena nem publica a mídia.

O `web-app` ainda não tem upload conectado a esta API. Para testar agora, envie uma imagem diretamente pela rota interna. Execute localmente com `./.venv/Scripts/python.exe -m uvicorn src.api.app:app --host 127.0.0.1 --port 8080` no PowerShell.

- [AGENTS.md](https://github.com/Solierrr/ai-accessibility/blob/main/AGENTS.md): contexto do projeto, arquitetura, fluxo de análise e orientações de manutenção.
