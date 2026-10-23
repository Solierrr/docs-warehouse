<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastify.png" alt="Fastify" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mailpit.png" width="100" hspace="8" alt="Mailpit" title="Mailpit">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Envio de e-mails automáticos

[![License](https://img.shields.io/github/license/Solierrr/api-email)](https://github.com/Solierrr/api-email/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-email)](https://github.com/Solierrr/api-email/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-email)](https://github.com/Solierrr/api-email/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-email)](https://github.com/Solierrr/api-email/releases)

Este serviço envia os e-mails automáticos da plataforma. Ele foi idealizado para que os outros serviços não precisem montar nem enviar mensagens por conta própria. Basta pedir o envio de um dos modelos prontos, como a confirmação de cadastro, a redefinição de senha, os convites para empresas e projetos e os avisos de aprovação de cadastros e de produtos, e o serviço entrega a mensagem com a identidade visual da plataforma, no idioma da pessoa.

Os modelos são escritos com React Email e enviados por SMTP com Nodemailer. Cada pedido é conferido antes do envio, e só são aceitos modelos conhecidos, com os dados obrigatórios de cada um e com links que apontam para endereços autorizados da plataforma. O acesso exige uma chave compartilhada entre os serviços, e também é possível visualizar a mensagem montada sem enviá-la. As mensagens estão disponíveis em português, inglês e espanhol. O serviço não guarda histórico nem refaz tentativas, então a confirmação do servidor de e-mail indica apenas que a mensagem foi aceita para entrega. No ambiente local, as mensagens chegam a uma caixa de testes do Mailpit.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-email/blob/main/docs/ARCHITECTURE.md), organização do código e estrutura do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-email/blob/main/docs/RUNNING.md), como executar o serviço localmente.
- [`http/README.md`](https://github.com/Solierrr/api-email/blob/main/http/README.md), coleção de chamadas para testar o serviço localmente.
- [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md), processo de publicação no ambiente de testes.
- [CONTRACT.md](https://github.com/Solierrr/api-email/blob/main/docs/CONTRACT.md), contrato de envio e serviços que usam o envio de e-mails.
- [DEVELOPMENT.md](https://github.com/Solierrr/api-email/blob/main/docs/DEVELOPMENT.md), como desenvolver e testar o serviço.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
