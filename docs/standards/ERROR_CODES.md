# Catálogo de erros

Lista única dos `errorCode` da organização, no formato do [contrato de erro](./ERRORS.md). É a fonte do front para as traduções: todo código novo entra aqui na mesma PR que o cria, e o front traduz pelo código, nunca pelo `detail`.

Levantamento inicial em 2026-10-24 na `main` de `api-core`, `api-auth`, `api-notify` e `api-email`. Os outros serviços registram os próprios códigos nas suas tarefas de padronização.

Situação:

- `ativo`: no padrão; pode ser usado.
- `legado`: em uso hoje, mas com substituto definido. O serviço troca na tarefa de padronização e o front aceita os dois até a troca chegar em PROD.
- `ajustar`: o código fica, mas algo muda (status, formato), descrito no significado.

## Genéricos

Podem ser emitidos por qualquer serviço.

| Código | Status | Serviço | Significado | Situação |
|---|---|---|---|---|
| `VALIDATION_FAILED` | 422 | todos | corpo, parâmetro ou cabeçalho inválido; detalhes em `errors` | ativo |
| `MALFORMED_REQUEST` | 422 | todos | corpo ilegível (JSON malformado, tipo errado); hoje sai com 400 em `api-core`, `api-auth` e `api-notify` | ajustar |
| `UNAUTHENTICATED` | 401 | todos | sem credencial, credencial inválida ou expirada (JWT ou `X-Service-Key`) | ativo |
| `FORBIDDEN` | 403 | todos | autenticado, sem permissão para a ação | ativo |
| `NOT_FOUND` | 404 | todos | recurso ou rota inexistente | ativo |
| `CONFLICT` | 409 | todos | conflito de estado sem código mais específico | ativo |
| `RATE_LIMITED` | 429 | todos | limite de requisições atingido | ativo |
| `INTERNAL_ERROR` | 500 | todos | erro inesperado | ativo |
| `DEPENDENCY_UNAVAILABLE` | 502, 503 | todos | dependência externa fora do ar ou com resposta inválida, sem código mais específico | ativo |

## Legados com substituto

| Código | Status | Serviço | Significado | Substituto |
|---|---|---|---|---|
| `VALIDATION_ERROR` | 400 | `api-core`, `api-auth`, `api-notify` | validação de corpo ou parâmetro | `VALIDATION_FAILED` (422) |
| `INVALID_PARAMETER` | 400 | `api-notify` | parâmetro com tipo inválido | `VALIDATION_FAILED` (422) |
| `MISSING_PARAMETER` | 400 | `api-notify` | parâmetro obrigatório ausente | `VALIDATION_FAILED` (422) |
| `INVALID_REQUEST` | 400 | `api-email` | corpo inválido | `VALIDATION_FAILED` (422) |
| `ACCESS_DENIED` | 403 | `api-core`, `api-auth`, `api-notify` | negação do Spring Security | `FORBIDDEN` |
| `UNAUTHORIZED_ACCESS` | 403 | `api-core`, `api-notify` | sem permissão para a ação | `FORBIDDEN` |
| `UNAUTHORIZED` | 401 | `api-email` | chave ausente ou inválida | `UNAUTHENTICATED` |
| `RESOURCE_NOT_FOUND` | 404 | `api-core`, `api-notify` | registro não encontrado | `NOT_FOUND`, ou um código específico do recurso (`PROJECT_NOT_FOUND`) |
| `REQUEST_ERROR` | variável | `api-auth` | erro do Spring sem tratamento próprio (rota inexistente, método não permitido) | o genérico do status (`NOT_FOUND`, `VALIDATION_FAILED`) |
| `INVALID_CREDENTIAL` | 401 | `api-auth` | senha atual incorreta na troca de senha | `INVALID_CREDENTIALS` |

## `api-core`

| Código | Status | Significado | Situação |
|---|---|---|---|
| `BUSINESS_RULE_VIOLATION` | 400 | regra de negócio violada; hoje sai com 422 | ajustar |
| `INVALID_FIELD` | 400 | campo com valor não aceito pela regra do serviço | ativo |
| `DUPLICATE_RESOURCE` | 409 | registro já existe | ativo |
| `RESOURCE_IN_USE` | 409 | registro referenciado por outro e não pode ser removido | ativo |
| `PROPOSAL_CONFLICT` | 409 | proposta em estado que não permite a operação | ativo |
| `INVALID_SERVICE_TRANSITION` | 409 | transição de estado do serviço não permitida | ativo |
| `INSUFFICIENT_STOCK` | 409 | estoque insuficiente; os itens vão em `items` | ativo |
| `DATA_INTEGRITY_VIOLATION` | 409 | operação viola uma restrição do banco (também no `api-notify`) | ativo |
| `CONCURRENT_MODIFICATION` | 409 | registro alterado por outra operação ao mesmo tempo (também no `api-notify`) | ativo |
| `USER_NOT_PROVISIONED` | 404 | usuário autenticado ainda não provisionado no `api-core` | ativo |
| `STORAGE_ERROR` | 502 | falha no armazenamento de arquivos | ativo |

## `api-auth`

| Código | Status | Significado | Situação |
|---|---|---|---|
| `INVALID_CREDENTIALS` | 401 | e-mail ou senha inválidos | ativo |
| `INVALID_REFRESH_TOKEN` | 401 | refresh token inválido | ativo |
| `REFRESH_TOKEN_REUSED` | 401 | reuso de refresh token detectado | ativo |
| `INVALID_SESSION` | 401 | sessão não pertence ao usuário autenticado | ativo |
| `INVALID_SERVICE_CREDENTIAL` | 401 | credencial de serviço inválida na revogação de sessão | ativo |
| `INVALID_ACCOUNT_LINK_CREDENTIALS` | 401 | credenciais da conta local inválidas na vinculação | ativo |
| `INVALID_FIREBASE_TOKEN` | 401 | ID token do Firebase inválido | ativo |
| `ACCOUNT_UNAVAILABLE` | 403 | conta indisponível | ativo |
| `WEB_SESSION_REQUIRED` | 403 | autorização do app exige sessão web | ativo |
| `EMAIL_NOT_VERIFIED` | 403 | e-mail ainda não verificado | ativo |
| `MOBILE_ACCOUNT_NOT_ALLOWED` | 403 | conta sem permissão para o app (profissional ativo, cadastro completo e aprovado) | ativo |
| `EMAIL_ALREADY_REGISTERED` | 409 | e-mail já cadastrado | ativo |
| `ACCOUNT_LINK_REQUIRED` | 409 | é preciso entrar na conta existente antes de vincular o Firebase | ativo |
| `FIREBASE_ACCOUNT_LINK_MISMATCH` | 409 | e-mail do Firebase diferente da conta que está sendo vinculada | ativo |
| `FEDERATED_IDENTITY_CONFLICT` | 409 | identidade do Firebase já vinculada a outra conta | ativo |
| `VERIFIED_FIREBASE_EMAIL_REQUIRED` | 422 | o Firebase precisa de e-mail verificado | ativo |
| `INVALID_CLIENT` | 400 | cliente do app inválido no fluxo de autorização | ativo |
| `INVALID_TRANSACTION` | 400 | transação de autorização do app inválida, cancelada ou consumida | ativo |
| `TRANSACTION_EXPIRED` | 400 | transação de autorização do app expirada | ativo |
| `CONFIRMATION_REQUIRED` | 400 | a autorização do app precisa de confirmação | ativo |
| `INVALID_GRANT` | 400 | código de autorização do app inválido | ativo |
| `LOCAL_CREDENTIAL_REQUIRED` | 400 | a conta não tem senha local | ativo |
| `PASSWORD_POLICY` | 400 | senha fora da política (12 a 72 bytes) | ativo |
| `INVALID_OR_EXPIRED_TOKEN` | 400 | token de e-mail inválido ou expirado | ativo |
| `IDENTITY_PROOF_REQUIRED` | 400 | migração de senha do Firebase sem prova de identidade | ativo |
| `MIGRATION_NOT_ALLOWED` | 400 | migração de senha do Firebase não permitida | ativo |
| `FIREBASE_UNAVAILABLE` | 503 | autenticação do Firebase indisponível | ativo |
| `EMAIL_UNAVAILABLE` | 503 | envio de e-mail indisponível | ativo |
| `EMAIL_NOT_CONFIGURED` | 503 | envio de e-mail não configurado | ativo |
| `ELIGIBILITY_UNAVAILABLE` | 503 | consulta de elegibilidade do app indisponível | ativo |
| `MOBILE_AUTH_NOT_CONFIGURED` | 503 | autorização do app não configurada | ativo |
| `SERVICE_NOT_CONFIGURED` | 503 | credencial de serviço não configurada | ativo |

## `api-email`

| Código | Status | Significado | Situação |
|---|---|---|---|
| `INVALID_ACTION_URL` | 400 | URL de ação fora dos domínios permitidos | ativo |
| `EMAIL_SEND_FAILED` | 503 | falha ao enviar o e-mail | ativo |

## Agentes de conversa (`reason`)

Valores de `reason` na resposta do turno, quando `outcome` não é `ANSWERED` ([contrato de erro](./ERRORS.md#por-tipo-de-serviço)). Ainda sem códigos; os agentes registram aqui na tarefa de padronização.

| Código | `outcome` | Serviço | Significado | Situação |
|---|---|---|---|---|
