<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

# Documento de arquitetura

README reutilizável. O `ARCHITECTURE.md` de cada repositório explica como o código está organizado e por que. Ele varia por família de stack, então cada família tem o seu documento-base, com o banner da sua tecnologia: copie o que combina com o repositório e preencha com o que o código realmente faz.

| Família | Documento | Banner | Repositórios |
|---|---|---|---|
| Spring Boot (Java e Kotlin) | [spring.md](./spring.md) | Spring Boot | `api-auth`, `api-core`, `api-messenger` |
| Serviços de IA (Python, LangChain e LangGraph) | [ai.md](./ai.md) | LangChain | `ai-assistant`, `ai-validation`, `ai-accessibility`, `ai-geographic`, `ai-operational` |
| Aplicações web (React) | [web.md](./web.md) | React | `web-app`, `web-sandbox`, `lib-web` |
| Workers da Cloudflare | [worker.md](./worker.md) | Cloudflare Workers | `web-worker` |

Outras famílias (Fastify, FastAPI sem agentes, infraestrutura, dados, mobile) seguem o modelo genérico em [`templates/readme/ARCHITETURE.template.md`](../../templates/readme/ARCHITETURE.template.md) até ganharem um documento próprio.

## Regras comuns

- Português, em parágrafos corridos, com no mínimo 60 palavras na introdução e quatro bullets de decisões.
- A árvore do repositório é a real, não a ideal.
- Só nomes de variáveis, nunca valores de segredo.
- O que o código não confirma vai marcado como `{a confirmar: ...}`.
- A linha de ícones da stack não repete a tecnologia do banner.
