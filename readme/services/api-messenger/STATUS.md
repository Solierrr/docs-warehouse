<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Estado atual do serviço

Comportamentos do código em `feat/rabbitmq-relay-multipod` @ `60d87c9` que um leitor não espera, e pontos em que o serviço diverge dos padrões da organização. Esta página registra o que existe. Ela não decide correções.

## Regras de negócio

- Nenhuma rota coloca uma conversa em `DEACTIVATED`. O código só reativa diretas que já estejam nesse status.
- O baseline de admissão não filtra o histórico. Quem entra num grupo lê as mensagens anteriores à entrada.
- Um gestor que é o único participante de um grupo não consegue sair sozinho. A saída exige sucessor, e não existe outro participante elegível. Só a cascata da comunidade, executada por outra pessoa, esvazia esse grupo.
- Um `ADMIN` rebaixa outro `ADMIN` para `MEMBER` por `POST /members` com `role: MEMBER`, e também pode removê-lo. O `OWNER` não pode sair, e não existe transferência de `OWNER`.
- Criar grupo e criar subgrupo aceitam parte dos convidados e devolvem os rejeitados. Criar comunidade, adicionar membros e adicionar participantes recusam a operação inteira se algum convidado for inexistente ou inativo.
- O campo `role` de `MessageRequestDTO` é validado e ignorado. O servidor grava sempre `user`.
- A expiração do digitando, depois de 5 s, não publica `TYPING_STOPPED`.
- Qualquer usuário autenticado lê qualquer avaliação, e o avaliador muda o status sem regra de transição.
- O NPS não confere o status da conversa. A telemetria de LLM não confere se a conversa existe.
- Um estado pessoal inválido em uma conversa humana faz `GET /messaging/conversations/me` falhar inteiro com 422.

## Execução em várias réplicas

- `ConversationMutationGuard` serializa só dentro de uma JVM. Entre réplicas, a correção depende de CAS, dos índices únicos e da transação de admissão.
- A contagem do limite de 4 sessões não é atômica entre réplicas, e um usuário de uma réplica morta segue online por até cerca de 2 minutos. Ver [REALTIME.md](./REALTIME.md#presença).
- `ActiveUserFilter` consulta o `api-auth` em toda requisição HTTP, sem cache. A latência e a disponibilidade do `api-auth` entram em todas as rotas `/messaging/**`.

## Erros fora do catálogo da organização

O [catálogo de erros](../../../docs/standards/ERROR_CODES.md) ainda não lista os códigos deste serviço. Os códigos genéricos divergem do catálogo:

| Este serviço | Catálogo |
|---|---|
| `VALIDATION_ERROR`, status 400 | `VALIDATION_FAILED`, status 422 |
| `MALFORMED_REQUEST`, status 400 | `MALFORMED_REQUEST`, status 422 |
| `UNAUTHORIZED_ACCESS` e `ACCESS_DENIED`, status 403 | `FORBIDDEN`, status 403 |
| `RESOURCE_NOT_FOUND`, status 404 | `NOT_FOUND`, status 404 |
| `BUSINESS_RULE_VIOLATION`, status 422 | sem equivalente genérico |

Os códigos específicos de [ERRORS.md](./ERRORS.md), como `SUCCESSOR_REQUIRED` e `MESSAGE_PERSISTENCE_UNCERTAIN`, também não estão no catálogo.

## Health do MongoDB

O grupo `readiness` usa o indicador padrão `mongo` do Spring Boot. O [padrão de health checks](../../../docs/standards/HEALTH.md) pede um indicador próprio com `ping` só no banco do serviço quando o MongoDB está no Atlas, porque o indicador padrão fica `DOWN` com o usuário do Atlas. O serviço não tem esse indicador.

## Configuração sem uso

- `app.jwt.service.secret`, `app.jwt.service.client-secret`, `app.jwt.service.issuer`, `app.jwt.service.access-ttl-ms` e `app.jwt.service.refresh-ttl-ms` sobraram do token de serviço removido.
- `app.websocket.max-sessions-per-user=4` não é lido. O limite está fixo em `LocalWebSocketSessionRegistry.MAX_SESSIONS_PER_USER`.

## Documentação no repositório

Os arquivos do repositório estão desatualizados em relação ao código e a esta pasta:

- `README.md` e `docs/ARCHITECTURE.md` descrevem um token de serviço HS256 em `/internal/**`, `POST /internal/service-tokens`, `ServiceTokenAuthFilter`, `MongoConfig`, a rota `/messaging/conversations/user-conversations` e um `MessageService` único. Nada disso existe. O `README.md` também diz que as avaliações são vinculadas às conversas, o que o código não faz.
- `docs/RUNNING.md` exige `SERVICE_JWT_SECRET` e `SERVICE_CLIENT_SECRET`, que o código não usa, e não cita RabbitMQ nem Redis.
- `.sdd/` e `.specs/` estão vazios.
- `pom.xml` e `spring.application.name` usam `messager`. Esse nome aparece como `service.name` na telemetria.

## Dependência do `api-core`

A criação de comunidade chama `GET /internal/technical-projects/{projectId}/requester-access/{authId}`. A rota existe no checkout local do `api-core` na branch `feat/internal-requester-access`. A presença dela na `main` não foi conferida.
