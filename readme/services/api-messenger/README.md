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

Este serviço armazena e entrega as conversas da plataforma. É por ele que clientes e profissionais trocam mensagens, e é nele que ficam as conversas com o assistente virtual. O serviço registra cada mensagem, mantém o histórico disponível para consulta e reúne as avaliações que as pessoas fazem de profissionais e produtos após uma conversa. Apenas os participantes de uma conversa podem consultar as mensagens dela.

## Ficha técnica

- **Tipo:** serviço HTTP.
- **Stack:** Java 21 e Spring Boot 4.
- **Dados:** MongoDB.
- **Autenticação:** JWT de usuário emitido pelo `api-auth` nas rotas públicas e token de serviço nas rotas internas.
- **Integrações:** `ai-assistant`, que grava as respostas do assistente e os registros de uso dos modelos.
- **Erros:** formato padrão RFC 7807.
- **Ambientes:** QA no Render e produção no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-messenger/blob/main/docs/ARCHITECTURE.md), camadas do serviço, modelagem no MongoDB, endpoints internos/públicos e árvore real do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-messenger/blob/main/docs/RUNNING.md), como subir este serviço localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), pipeline de deploy padrão da organização (`main`/`qa`, Docker Hub, ArgoCD).
- [`http/README.md`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md), coleção Bruno para executar e manter as chamadas locais da API.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-messenger/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- {a confirmar: CODE_OF_CONDUCT.md e SECURITY.md ainda não existem neste repositório — ver se devem ser adicionados ou linkados a partir do repositório `.github` compartilhado da organização}
