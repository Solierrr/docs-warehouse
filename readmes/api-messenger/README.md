<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.jpg" alt="Solaria api-messenger, Spring Boot" width="100%">
</p>

# api-messenger

O `api-messenger` é o serviço de mensageria da Solaria, responsável por armazenar e servir todo o histórico de conversas trocadas na plataforma — tanto conversas usuário-a-usuário quanto conversas usuário-a-chatbot atendidas pelo pipeline de LLM. O serviço modela conversas e mensagens sobre MongoDB, expõe endpoints protegidos por JWT de usuário (emitido pelo `api-auth`) para o fluxo humano, e uma rota interna autenticada por token de serviço M2M para que o pipeline de IA (`ai-assistant`) publique respostas do chatbot e registre observabilidade de cada chamada de LLM/ferramenta (tokens consumidos, latência, especialistas acionados). Também centraliza avaliações (ratings) de profissionais e produtos vinculadas às conversas.

<p>

[![License](https://img.shields.io/github/license/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/commits)
[![GitHub Issues](https://img.shields.io/github/issues/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/pulls)
[![GitHub Contributors](https://img.shields.io/github/contributors/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/graphs/contributors)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/releases)

</p>

## Stack

<table align="center">
  <tr>
    <th align="left">Aplicação</th>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.jpg" width="72" alt="Java"><br><sub>Java 21</sub></td>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/springboot.jpg" width="72" alt="Spring Boot"><br><sub>Spring Boot</sub></td>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.jpg" width="72" alt="Spring Security"><br><sub>Spring Security</sub></td>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.jpg" width="72" alt="Maven"><br><sub>Maven</sub></td>
  </tr>
  <tr>
    <th align="left">Dados</th>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.jpg" width="72" alt="MongoDB"><br><sub>MongoDB</sub></td>
    <td colspan="3"></td>
  </tr>
  <tr>
    <th align="left">API e testes</th>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.jpg" width="72" alt="Swagger"><br><sub>Swagger</sub></td>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.jpg" width="72" alt="Bruno"><br><sub>Bruno</sub></td>
    <td colspan="2"></td>
  </tr>
  <tr>
    <th align="left">Observabilidade</th>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/opentelemetry.jpg" width="72" alt="OpenTelemetry"><br><sub>OpenTelemetry</sub></td>
    <td colspan="3"></td>
  </tr>
  <tr>
    <th align="left">Entrega</th>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.jpg" width="72" alt="Docker"><br><sub>Docker</sub></td>
    <td align="center" width="110"><img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.jpg" width="72" alt="GitHub Actions"><br><sub>GitHub Actions</sub></td>
    <td colspan="2"></td>
  </tr>
</table>

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-messenger/blob/main/docs/ARCHITECTURE.md), camadas do serviço, modelagem no MongoDB, endpoints internos/públicos e árvore real do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-messenger/blob/main/docs/RUNNING.md), como subir o `api-messenger` localmente e impedimentos conhecidos.
- [DEPLOYMENT.md](https://github.com/Solierrr/.github/blob/main/.github/DEPLOYMENT.md), pipeline de deploy padrão da organização (`main`/`qa`, Docker Hub, ArgoCD).
- [`http/README.md`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md), coleção Bruno para executar e manter as chamadas locais da API.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-messenger/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- {a confirmar: CODE_OF_CONDUCT.md e SECURITY.md ainda não existem neste repositório — ver se devem ser adicionados ou linkados a partir do repositório `.github` compartilhado da organização}
