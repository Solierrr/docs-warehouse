<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
</p>

# Erros

O HTTP responde erros como `ProblemDetail`  com `Content-Type: application/problem+json`. O STOMP envia o mesmo `errorCode` em `WsErrorPayload`, no tópico `/topic/users.{userId}.errors`. O padrão da organização está no [contrato de erro](../../../docs/standards/ERRORS.md) e no [catálogo de erros](../../../docs/standards/ERROR_CODES.md). As diferenças entre este serviço e o catálogo estão em [STATUS.md](./STATUS.md#erros-fora-do-catálogo-da-organização).

## Formato

`ProblemDetailFactory` monta o corpo:

| Campo | Valor |
|---|---|
| `type`, `status` | padrão do `ProblemDetail` |
| `title` | o `errorCode` |
| `detail` | mensagem da exceção |
| `instance` | URI da requisição |
| `errorCode` | código estável |
| `timestamp` | instante do erro |
| extras | `conversationId`, `clientMessageId` ou `errors` (lista de `{field, message}`), quando a exceção os traz |

O Spring não inclui mensagem, stacktrace, exceção nem erros de binding no corpo padrão (`spring.web.error.include-*`). Todo erro tratado marca o span da requisição como erro. Erros 4xx viram log `WARN`, e erros 5xx viram log `ERROR` com stacktrace. Com o tracing ligado, toda resposta leva o header `X-Trace-Id`.

`BusinessException` é a base das exceções de domínio. Cada subclasse fixa o status HTTP e o `errorCode`.

## Códigos

| HTTP | `errorCode` | Quando |
|---|---|---|
| 400 | `INVALID_FIELD` | regra de campo verificada no serviço |
| 400 | `VALIDATION_ERROR` | Bean Validation no corpo ou nos parâmetros |
| 400 | `MALFORMED_REQUEST` | JSON ilegível |
| 401 | `UNAUTHENTICATED` | token ausente, inválido, expirado, de tipo diferente de `access` ou com `sub` fora do formato UUID |
| 403 | `UNAUTHORIZED_ACCESS` | sem participação, sem propriedade, sem papel na comunidade, ou usuário inativo ou inexistente no `api-auth` |
| 403 | `ACCESS_DENIED` | negação dentro da cadeia de filtros do Spring Security |
| 404 | `RESOURCE_NOT_FOUND` | recurso inexistente, ou usuário inexistente numa validação de convidados |
| 409 | `DUPLICATE_RESOURCE` | comunidade do projeto ou NPS da conversa já existe |
| 409 | `DATA_INTEGRITY_VIOLATION` | um índice único recusou a escrita |
| 409 | `CONCURRENT_MODIFICATION` | CAS perdido depois das tentativas, ou sequência esgotada |
| 409 | `DIRECT_IDENTITY_INCONSISTENT` | a direta encontrada não corresponde ao par ou à chave |
| 409 | `GROUP_MANAGER_UNAVAILABLE` | grupo sem gestor válido para a operação |
| 409 | `SUCCESSOR_REQUIRED` | o gestor saiu sem indicar sucessor |
| 409 | `SUCCESSOR_INELIGIBLE` | sucessor não participa, não é membro da comunidade ou está inativo |
| 409 | `MEMBERSHIP_CLEANUP_REQUIRED` | readmissão na comunidade de quem ainda está em algum subgrupo |
| 422 | `BUSINESS_RULE_VIOLATION` | regra de negócio violada, inclusive estado pessoal com baseline indisponível |
| 503 | `DEPENDENCY_UNAVAILABLE` | `api-auth`, `api-core` ou MongoDB indisponível ou com resposta inválida |
| 503 | `MESSAGE_PERSISTENCE_UNCERTAIN` | não se sabe se a mensagem foi gravada |
| 503 | `MESSAGE_MUTATION_UNCERTAIN` | não se sabe se a edição ou exclusão foi gravada |
| 503 | `CONVERSATION_PERSISTENCE_UNCERTAIN` | a transação de criação de conversa falhou sem confirmação |
| 503 | `DIRECT_REACTIVATION_UNCERTAIN` | não se sabe se a direta foi reativada |
| 503 | `ADMISSION_PERSISTENCE_UNCERTAIN` | a transação de admissão de participantes falhou sem confirmação |
| 503 | `REMOVAL_INCOMPLETE` | a cascata de remoção da comunidade parou no meio. Repetir o `DELETE` continua de onde parou |
| 500 | `INTERNAL_ERROR` | exceção não tratada |

Os códigos terminados em `_UNCERTAIN` indicam que a escrita pode ter acontecido. Consulte o recurso antes de repetir a operação. Os erros que dizem "esta tentativa não inseriu mensagem" garantem que nada foi gravado.

## Códigos só do STOMP

| Código | Quando | Efeito |
|---|---|---|
| `SEND_NOT_ALLOWED` | `SEND` para um destino fora da allowlist | descarta o frame |
| `SUBSCRIBE_NOT_ALLOWED` | `SUBSCRIBE` em destino não permitido | descarta o frame |
| `SUBSCRIBE_DESTINATION_REQUIRED` | `SUBSCRIBE` sem destino | descarta o frame |
| `COMMAND_NOT_ALLOWED` | comando STOMP fora da allowlist | descarta o frame |
| `SESSION_LIMIT_EXCEEDED` | quinta sessão do usuário | frame `ERROR` no CONNECT e fechamento da sessão |

Os quatro primeiros chegam em `/topic/users.{userId}.errors`, e a conexão continua aberta.
