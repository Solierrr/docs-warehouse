<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

# Modelo para novos repositórios

[![License](https://img.shields.io/github/license/Solierrr/generic-template)](https://github.com/Solierrr/generic-template/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/generic-template)](https://github.com/Solierrr/generic-template/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/generic-template)](https://github.com/Solierrr/generic-template/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/generic-template)](https://github.com/Solierrr/generic-template/releases)

Este repositório é o ponto de partida para novos repositórios da organização. Ao criar um projeto a partir dele, o time substitui os textos de exemplo, preenche as configurações da aplicação e mantém a documentação alinhada ao que o serviço oferece. Ele já traz a estrutura de documentação, a configuração de container e exemplos de chamadas à API. Os arquivos que o tipo do novo repositório não utiliza são removidos após a criação.

## Ficha técnica

- **Tipo:** modelo de repositório.
- **Conteúdo:** Dockerfile, launcher opcional para segredos em runtime, coleção Bruno, `.env.example`, Makefile e workflows.
- **Decisões:** o modelo é completo de propósito; cada repositório novo remove o que o seu tipo não usa.

## Aprofunde-se no Projeto!

- [`http/README.md`](https://github.com/Solierrr/generic-template/blob/main/http/README.md), coleção Bruno para executar e manter as chamadas locais da API.
- [STRUCTURE.md](https://github.com/Solierrr/generic-template/blob/main/docs/STRUCTURE.md), arquivos do molde, cliente HTTP local e inicialização no Render.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
