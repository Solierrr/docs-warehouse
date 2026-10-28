<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Rotas HTTP

# Rotas HTTP

Visão das rotas por domínio. Campos, tipos e respostas ficam no Swagger (`/swagger-ui.html`) e em [`openapi.yaml`](https://github.com/Solierrr/api-messenger/blob/main/openapi.yaml). Para chamar as rotas localmente, use a coleção Bruno em [`http/`](https://github.com/Solierrr/api-messenger/blob/main/http/README.md). Erros seguem [ERRORS.md](./ERRORS.md).

| Prefixo | Acesso | Consumidor |
|---|---|---|
| `/messaging/**` | JWT do `api-auth` e usuário ativo | web-app e mobile |
| `/internal/**` | sem autenticação de aplicação, protegido pela rede | `ai-assistant` |
| `/ws`, `/messaging/ws` | autenticação no CONNECT STOMP | web-app e mobile |

Detalhes de acesso em [ACCESS.md](./ACCESS.md).

## Conversas

`/messaging/conversations` cria diretas, grupos avulsos e conversas com o chatbot, lista as conversas do usuário com os marcadores de sincronização, altera o estado pessoal (leitura, silenciar e arquivar) e gere os participantes e o gestor de um grupo. Regras em [CONVERSATIONS.md](./CONVERSATIONS.md).

## Mensagens

`/messaging/messages` envia, edita, exclui e pagina o histórico de uma conversa por sequência. Regras em [MESSAGES.md](./MESSAGES.md).

## Comunidades

`/messaging/communities` cria a comunidade de um projeto, consulta, arquiva e reativa, gere membros e papéis e cria ou lista subgrupos. Regras em [COMMUNITIES.md](./COMMUNITIES.md).

## Avaliações e NPS

`/messaging/ratings` cria, consulta, edita e muda o status de avaliações. `/messaging/nps` registra o NPS de uma conversa com o chatbot. Regras em [RATINGS_AND_NPS.md](./RATINGS_AND_NPS.md).

## Rotas internas

`/internal/messages` recebe as respostas do chatbot ([MESSAGES.md](./MESSAGES.md#resposta-do-chatbot)). `/internal/observability` registra e consulta a telemetria do pipeline de LLM ([LLM_OBSERVABILITY.md](./LLM_OBSERVABILITY.md)).

## Operação

`/actuator/health` e `/actuator/info` são públicos. Ver [RUNNING.md](./RUNNING.md#health-e-telemetria). `POST /dev/login` existe só no perfil `dev`. Ver [ACCESS.md](./ACCESS.md#login-de-desenvolvimento). O tempo real está em [REALTIME.md](./REALTIME.md).
