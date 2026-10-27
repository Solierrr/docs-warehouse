<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/maven.png" width="100" hspace="8" alt="Maven" title="Maven">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Central de mensagens

[![License](https://img.shields.io/github/license/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-messenger)](https://github.com/Solierrr/api-messenger/releases)

Este serviço guarda e entrega as conversas da plataforma. Clientes, profissionais e empresas conversam sem sair dela, em conversas individuais, em grupos avulsos e nos subgrupos da comunidade de cada projeto. O serviço também guarda as conversas de cada pessoa com o assistente virtual e recebe as respostas que o assistente produz. As mensagens chegam em tempo real, com aviso de quem está conectado e de quem está digitando. O histórico continua disponível para consulta depois que a conversa termina.

Além das conversas, o serviço registra as avaliações de profissionais e de produtos, a nota que a pessoa dá ao atendimento do assistente e os dados de uso dos modelos de linguagem em cada etapa do atendimento.

## Responsabilidades

- Conversas diretas entre duas pessoas, grupos avulsos e conversas com o chatbot, com histórico ordenado por conversa.
- Comunidade de projeto: espaço por projeto técnico do `api-core`, com papéis `OWNER`, `ADMIN` e `MEMBER` e subgrupos de conversa entre os membros.
- Estado pessoal de cada participante: leitura, não lidas, silenciar e arquivar.
- Tempo real por STOMP sobre WebSocket: mensagens, confirmação de envio, lista de conversas, presença e digitando, com várias réplicas do serviço atrás de um broker RabbitMQ.
- Respostas do chatbot recebidas do `ai-assistant` por rota interna.
- Avaliações (`PROFISSIONAL` e `PRODUTO`) e NPS das conversas com o chatbot.
- Telemetria do pipeline de LLM: tokens, latência e custo de cada chamada a modelo ou a ferramenta.

O serviço não aciona o pipeline de IA. O `ai-assistant` chama o `api-messenger`. O serviço também não replica dados de outros serviços: consulta a atividade do usuário no `api-auth` e a autoridade sobre o projeto no `api-core` a cada uso.

## Stack

| Item | Uso |
|---|---|
| Java 21 e Spring Boot 4.1.0 | aplicação (Spring MVC sobre Tomcat) |
| Spring WebSocket (STOMP) e `reactor-netty-core` | tempo real, com relay STOMP para o RabbitMQ |
| RabbitMQ 4 com plugin STOMP | broker externo que entrega eventos a todas as réplicas ([`infra-broker`](https://github.com/Solierrr/infra-broker)) |
| MongoDB (Spring Data MongoDB) | conversas, mensagens, comunidades, avaliações, NPS, telemetria de LLM e relógio de sincronização |
| Redis (Spring Data Redis, Upstash) | presença entre réplicas, limite de sessões e revogação de sessões |
| Spring Security OAuth2 Resource Server | validação do JWT do `api-auth` (RS256, JWKS) |
| Bean Validation | validação dos corpos de requisição e dos payloads STOMP |
| springdoc-openapi 2.8.6 | Swagger em `/swagger-ui.html` |
| Actuator, OpenTelemetry e appender OTel do Logback | health, métricas, traces e logs exportados por OTLP |
| Lombok e Maven Wrapper | build |

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](./ARCHITECTURE.md), camadas, diretórios e modelo de concorrência.
- [DATA_MODEL.md](./DATA_MODEL.md), coleções do MongoDB, índices e chaves do Redis.
- [ACCESS.md](./ACCESS.md), autenticação, usuário ativo, autorização e chamadas a outros serviços.
- [API.md](./API.md), rotas HTTP, campos validados e respostas.
- [CONVERSATIONS.md](./CONVERSATIONS.md), regras de direta, grupo, gestão de grupo, chatbot, estado pessoal e lista de conversas.
- [COMMUNITIES.md](./COMMUNITIES.md), regras de comunidade, papéis, membros, remoção em cascata e subgrupos.
- [MESSAGES.md](./MESSAGES.md), regras de envio, sequência, edição, exclusão e histórico.
- [REALTIME.md](./REALTIME.md), contrato STOMP: conexão, destinos, eventos, presença, digitando e revogação.
- [RATINGS_AND_NPS.md](./RATINGS_AND_NPS.md), regras de avaliações e de NPS.
- [LLM_OBSERVABILITY.md](./LLM_OBSERVABILITY.md), ingestão e consulta da telemetria do pipeline de LLM.
- [ERRORS.md](./ERRORS.md), formato do erro e catálogo de `errorCode` do serviço.
- [RUNNING.md](./RUNNING.md), dependências, variáveis de ambiente, execução local, health e telemetria.
- [STATUS.md](./STATUS.md), comportamentos atuais que merecem atenção e divergências com os padrões da organização.
- [`http/README.md`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md), coleção Bruno com as chamadas do serviço.
- [QA_RENDER.md](../../deploy/QA_RENDER.md) e [PROD_GKE_ARGOCD.md](../../deploy/PROD_GKE_ARGOCD.md), publicação em QA e em produção.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-messenger/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
