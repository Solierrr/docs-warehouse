<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/google-maps.png" width="100" hspace="8" alt="Google Maps" title="Google Maps">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Copiloto de campo do profissional

[![License](https://img.shields.io/github/license/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/releases)

Este serviço é um assistente para profissionais de energia solar que trabalham em campo, como técnicos, instaladores e engenheiros, e é usado pelo aplicativo móvel da plataforma. Ele ajuda a planejar o deslocamento até o cliente, a avaliar se vale a pena visitar uma região em determinada data, com base em chuva, vento e horas de luz do dia, e a estimar o potencial solar do local. Perguntas sobre produtos são encaminhadas ao assistente virtual principal.

## Ficha técnica

- **Tipo:** serviço HTTP de inteligência artificial.
- **Stack:** Python, LangChain e LangGraph.
- **Modelos:** Gemini e Groq.
- **Dados:** MongoDB e Redis.
- **Integrações:** Google Maps e `ai-assistant`.
- **Consumidor:** aplicativo móvel.
- **Ambientes:** QA no Render; ainda sem produção.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/ai-geographic/blob/main/docs/ARCHITECTURE.md)
- [RUNNING.md](https://github.com/Solierrr/ai-geographic/blob/main/docs/RUNNING.md)

## Contribuindo

- Escreva commits em Conventional Commits, em inglês e minúsculas (`feat:`, `fix:` etc.).
- Todo PR deve usar o `.github/pull_request_template.md` deste repositório.
