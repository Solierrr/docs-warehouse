<p align="center">
  <img src="./assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

<p align="center">
  <img src="./assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
</p>

# Broker de mensagens

[![License](https://img.shields.io/github/license/Solierrr/infra-broker)](https://github.com/Solierrr/infra-broker/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-broker)](https://github.com/Solierrr/infra-broker/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-broker)](https://github.com/Solierrr/infra-broker/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-broker)](https://github.com/Solierrr/infra-broker/releases)

Este repositório fornece o broker de mensagens usado nas conversas em tempo real. Quando uma pessoa participa de uma conversa, as mensagens precisam chegar às sessões conectadas mesmo que elas estejam em instâncias diferentes do serviço de conversas. O broker distribui esses eventos entre as instâncias, sem oferecer uma interface diretamente às pessoas.

A imagem usa RabbitMQ 4 com o plugin STOMP. O serviço de conversas encaminha os tópicos pelo relay STOMP quando recebe a configuração de conexão do broker. Com o relay desligado, ele usa um broker em memória, limitado a uma instância. O repositório também traz um ambiente local em Docker Compose, com volume para os dados do RabbitMQ.

## Aprofunde-se no Projeto!

- [OVERVIEW.md](./docs/OVERVIEW.md), o papel do broker nas conversas.
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md), configuração, portas e integração técnica.
- [RUNNING.md](./docs/RUNNING.md), como iniciar e conferir o broker localmente.
- [API.md](./docs/API.md), como o serviço de conversas se conecta por STOMP.
- [DEPLOY.md](./docs/DEPLOY.md), imagem e condições para publicação.
- [STATUS.md](./docs/STATUS.md), o que está configurado e as lacunas verificadas.
- [Fluxos](./flows/), o caminho de uma mensagem até as sessões conectadas.
- [PENDENCIAS.md](./PENDENCIAS.md), decisões a confirmar com o dono.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar uma vulnerabilidade.
