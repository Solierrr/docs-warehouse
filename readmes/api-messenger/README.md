<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Solaria, Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="64" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/springboot.png" width="64" alt="Spring Boot" title="Spring Boot">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="64" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="64" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="64" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="64" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="64" alt="Bruno" title="Bruno">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/opentelemetry.png" width="64" alt="OpenTelemetry" title="OpenTelemetry">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="64" alt="Docker" title="Docker">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="64" alt="GitHub Actions" title="GitHub Actions">
</p>

# Central de mensagens da Solaria

[![License](https://img.shields.io/github/license/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/releases)

Este serviço guarda e entrega todas as conversas da Solaria. É por ele que clientes e profissionais trocam mensagens, e também onde ficam as conversas com o assistente virtual da plataforma. Ele registra cada mensagem enviada, mantém o histórico disponível para consulta a qualquer momento e reúne as avaliações que as pessoas fazem de profissionais e produtos depois de uma conversa. Os detalhes técnicos, como autenticação, rotas e organização dos dados, ficam na documentação de arquitetura.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-messenger/blob/main/docs/ARCHITECTURE.md), camadas do serviço, modelagem no MongoDB, endpoints internos/públicos e árvore real do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-messenger/blob/main/docs/RUNNING.md), como subir o `api-messenger` localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/.github/blob/main/.github/DEPLOYMENT.md), pipeline de deploy padrão da organização (`main`/`qa`, Docker Hub, ArgoCD).
- [`http/README.md`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md), coleção Bruno para executar e manter as chamadas locais da API.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-messenger/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- {a confirmar: CODE_OF_CONDUCT.md e SECURITY.md ainda não existem neste repositório — ver se devem ser adicionados ou linkados a partir do repositório `.github` compartilhado da organização}
