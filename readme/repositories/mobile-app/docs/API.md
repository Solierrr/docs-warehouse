<p align="center">
  <img src="../assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Protocolos do aplicativo

O aplicativo consome APIs e não publica OpenAPI HTTP próprio. A entrada externa é o callback registrado no manifest. Os contratos de backend pertencem aos serviços.

## Callback e identidade

O redirect vem de `BuildConfig.AUTH_REDIRECT_URI`. O manifest define esquema por variante, host `auth` e caminho `/callback`. A Activity recebe `code` e `state`, remove a URI do Intent e encaminha a troca. O state deve coincidir com a pendência guardada, consumida uma vez.

A sequência REST usa `POST /auth/mobile/transactions`, `POST /auth/mobile/token`, `POST /auth/refresh` e `POST /auth/sessions/current/logout`. O navegador realiza a autorização. O app não solicita chave de serviço.

## Contratos consumidos

| Grupo | Uso |
|---|---|
| `api/projects` e sub-recursos | Consulta e criação de projeto, membros, atividades, histórico e fotos |
| Perfil e conexões no cadastro central | Dados da pessoa e das conexões |
| `messaging/conversations` | Lista, conversa direta e estado pessoal |
| `messaging/messages` | Histórico, envio, edição e exclusão |
| `messaging/updates` | Catch-up por cursor e época |
| `v1/address/geocode` | Endereço quando o flavor configura o destino |

Os clientes estão em [AuthApi](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/core/auth/AuthApi.kt), [ProjectApi](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/feature/project/data/ProjectApi.kt), [ProfileApi](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/feature/profile/data/ProfileApi.kt), [MessengerApi](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/feature/communication/data/MessengerApi.kt) e [RegistryApi](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/feature/discovery/data/RegistryApi.kt).

## Tempo real

A URL REST de mensagens vira WebSocket com caminho `/messaging/ws`. Krossbow envia Bearer no CONNECT e heartbeat de 10 segundos. Eventos privados chegam por `/topic/users.{userId}.events`. O cliente acompanha o ciclo de vida e desconecta ao ir para segundo plano.

Presença usa `/topic/conversations.{conversationId}`. Digitação envia `/app/typing.started` e `/app/typing.stopped`. Transporte reconecta com espera crescente de 1 a 30 segundos. Falha identificada como autenticação encerra a tentativa sem repetição indefinida.

## Erros

O cliente categoriza 400 e 422 como validação, 401 como sessão, 403 como permissão, 404 como ausência, 409 como conflito, 429 como limite e 5xx como servidor. Campos de validação vêm de `errors[].field`. O contrato dos servidores está em [erros HTTP](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md).

A categoria define o tratamento da fila. Validação, permissão ou destino ausente marca a mensagem como falha. Sessão inválida pausa. Outras falhas permitem tentar depois. O cliente verifica histórico recente antes de reenviar, sem demonstrar envio único no servidor. <!-- PENDENTE: 5 -->
