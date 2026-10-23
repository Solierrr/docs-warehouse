<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Recomendações para o marketplace

[![License](https://img.shields.io/github/license/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-recommendation)](https://github.com/Solierrr/api-recommendation/releases)

Este serviço escolhe o que aparece nas vitrines de recomendação do marketplace. Ele foi idealizado para mostrar a cada empresa os profissionais, as ofertas de placas solares e os fornecedores mais adequados, em uma ordem que faça sentido para ela. A lista pode seguir critérios diferentes, como os profissionais mais bem avaliados, as ofertas com melhor custo-benefício ou os fornecedores mais próximos, e quem ainda não entrou na conta também vê recomendações públicas.

As recomendações saem de um grafo no Neo4j, que guarda as relações entre empresas, profissionais, ofertas e fornecedores e é montado a partir do banco principal por outra rotina. Quando o grafo está indisponível ou ainda não foi montado, o serviço responde com uma seleção de itens elegíveis lida diretamente do PostgreSQL. O serviço apenas lê dados e nunca os altera. As listas de quem está autenticado são pedidas pelo cadastro central com uma chave de acesso que não chega ao navegador, e as listas públicas não exigem chave e ficam em cache na Cloudflare.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-recommendation/blob/main/docs/ARCHITECTURE.md), organização do código e estrutura do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-recommendation/blob/main/docs/RUNNING.md), como executar o serviço localmente.
- [FEEDS.md](https://github.com/Solierrr/api-recommendation/blob/main/docs/FEEDS.md), listas de recomendação, critérios, resposta sem o grafo e cache.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
