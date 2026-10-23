<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Ajudante para operar o sistema

[![License](https://img.shields.io/github/license/Solierrr/ai-operational)](https://github.com/Solierrr/ai-operational/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/ai-operational)](https://github.com/Solierrr/ai-operational/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/ai-operational)](https://github.com/Solierrr/ai-operational/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/ai-operational)](https://github.com/Solierrr/ai-operational/releases)

Este serviço é um assistente que orienta o uso do sistema da plataforma por fornecedores, demandantes e administradores de empresa. Ele indica a tela adequada para cada tarefa e, quando solicitado, propõe uma ação, como cadastrar uma oferta de placa solar, descrevendo antes o que será feito. Nenhuma ação é executada sem a confirmação da pessoa. O serviço é acionado pelo assistente virtual principal sempre que o pedido envolve uma operação no sistema.

## Ficha técnica

- **Tipo:** serviço HTTP de inteligência artificial.
- **Stack:** Python, LangChain e LangGraph.
- **Modelos:** Gemini e Groq.
- **Dados:** MongoDB e Redis.
- **Integrações:** acionado pelo `ai-assistant`.
- **Decisões:** toda ação que grava dados exige confirmação explícita da pessoa.
- **Ambientes:** QA no Render; ainda sem produção.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/ai-operational/blob/main/docs/ARCHITECTURE.md)
- [RUNNING.md](https://github.com/Solierrr/ai-operational/blob/main/docs/RUNNING.md)

## Contribuindo

- Escreva commits em Conventional Commits, em inglês e minúsculas (`feat:`, `fix:` etc.).
- Todo PR deve usar o `.github/pull_request_template.md` deste repositório.
