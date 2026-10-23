<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Central de mensagens

[![License](https://img.shields.io/github/license/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/releases)

Este serviço concentra as conversas da plataforma. Ele foi idealizado para que clientes, profissionais e empresas conversem sem sair da plataforma, em conversas individuais, em grupos e na comunidade de cada projeto, e para guardar também as conversas com o assistente virtual. Qualquer pessoa pode iniciar uma conversa com outra a qualquer momento. A comunidade de um projeto é criada junto com ele e reúne a equipe e o cliente. O histórico fica disponível para consulta, e a pessoa pode dar uma nota ao atendimento do assistente.

As mensagens chegam em tempo real por WebSocket, que também mostra quando alguém está digitando ou conectado, e cada pessoa tem um limite de conexões simultâneas. O acesso das pessoas é validado pelo token JWT emitido pelo serviço de acesso, conferido pela chave pública dele. As rotas usadas por outros serviços, como o assistente virtual ao gravar as suas respostas e os registros de uso dos modelos de linguagem, exigem um token de serviço emitido pelo próprio serviço. As conversas ficam no MongoDB, e nas comunidades de projeto o serviço consulta o cadastro central para saber quem pode participar.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-messenger/blob/main/docs/ARCHITECTURE.md), organização do código, modelo de dados e estrutura do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-messenger/blob/main/docs/RUNNING.md), como executar o serviço localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), processo de publicação nos ambientes de testes e de produção.
- [`http/README.md`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md), coleção de chamadas para testar o serviço localmente.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-messenger/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- {a confirmar: CODE_OF_CONDUCT.md e SECURITY.md ainda não existem neste repositório — ver se devem ser adicionados ou linkados a partir do repositório `.github` compartilhado da organização}
