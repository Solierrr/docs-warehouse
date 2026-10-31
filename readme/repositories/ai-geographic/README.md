<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/python.png" width="100" hspace="8" alt="python" title="python">
  <img src="./assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="mongodb" title="mongodb">
  <img src="./assets/readme/stacks/google-maps.png" width="100" hspace="8" alt="google-maps" title="google-maps">
  <img src="./assets/readme/stacks/gemini.png" width="100" hspace="8" alt="gemini" title="gemini">
  <img src="./assets/readme/stacks/groq.png" width="100" hspace="8" alt="groq" title="groq">
</p>

# Copiloto de campo

[![License](https://img.shields.io/github/license/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/ai-geographic)](https://github.com/Solierrr/ai-geographic/releases)

O copiloto atende profissionais de instalação e manutenção que precisam organizar visitas em campo. Ele ajuda a planejar deslocamentos, avaliar condições do tempo e consultar uma estimativa do potencial solar de um telhado. As respostas apoiam a preparação da visita e não substituem o estudo técnico do projeto.

A conversa combina consultas ao Google Maps, dados solares e recomendações de produtos obtidas com outro assistente. O acesso usa o JWT da plataforma. O MongoDB conserva o estado da conversa e fatos do profissional para os próximos atendimentos, enquanto o serviço de mensagens recebe o histórico e os registros de execução.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), finalidade e regras de produto.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), componentes, dados e integrações.
- [RUNNING.md](./docs/RUNNING.md), preparação e execução local.
- [API.md](./docs/API.md), autenticação e uso do contrato.
- [DEPLOY.md](./docs/DEPLOY.md), ambientes e publicação.
- [STATUS.md](./docs/STATUS.md), limites observados.
- [CHAT_TURN.md](./flows/CHAT_TURN.md), detalhes do fluxo ou modelo de dados.
- [ROOF_VIABILITY.md](./flows/ROOF_VIABILITY.md), detalhes do fluxo ou modelo de dados.
- [MONGO.md](./database/MONGO.md), detalhes do fluxo ou modelo de dados.
- [PENDENCIAS.md](./PENDENCIAS.md), questões para revisão.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de contribuição.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), relato de vulnerabilidades.
