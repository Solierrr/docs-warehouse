<p align="center">
  <img src="../assets/readme/banners/fastify.png" alt="Fastify" width="100%">
</p>

# API de e-mails

O contrato completo está no [`openapi.yaml`](https://github.com/Solierrr/api-email/blob/main/openapi.yaml), gerado do código e conferido no CI. O [Swagger de QA](https://api-email-6swz.onrender.com/docs) e `/openapi.json` são servidos quando `DOCS_ENABLED` permite. Não há prefixo `/internal`, pois as operações de e-mail atendem somente serviços.

## Autenticação

As rotas de prévia e envio exigem `X-Service-Key`. Os chamadores aceitos são `api-core` e `api-auth`, com chaves próprias nas variáveis `SERVICE_KEY_API_CORE` e `SERVICE_KEY_API_AUTH`. O contrato declara o esquema `serviceKey`.

O modo de compatibilidade aceita `X-API-Key` enquanto `EMAIL_API_KEY` estiver configurado e identifica a chamada como `api-core`. A presença de uma chave nova inválida não provoca fallback para a legada. A retirada desse caminho depende da migração dos consumidores. <!-- PENDENTE: 3 -->

O serviço não oferece login por JWT. A chave de serviço pertence ao backend chamador e não deve ser incorporada ao cliente web. O padrão está em [SERVICE_AUTH.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/SERVICE_AUTH.md).

## Operações

O contrato tem dois grupos de rotas.

| Grupo | Operação | Resultado |
|---|---|---|
| E-mails | `POST /emails/preview` | assunto, HTML e texto sem contato com o transporte |
| E-mails | `POST /emails` | HTTP 200 com `status` igual a `accepted` e `messageId` após aceite do transporte |
| Saúde | `GET /health` | processo e versão, sem autenticação |
| Saúde | `GET /ready` | verificação do transporte, sem autenticação |

`accepted` não comprova entrega na caixa postal. Não há identificador de idempotência, histórico consultável nem retry automático neste serviço. Repetir após timeout pode duplicar a mensagem. <!-- PENDENTE: 4 -->

## Modelos e limites

Os identificadores do contrato correspondem aos nove modelos de produto.

| Identificador | Uso |
|---|---|
| `email-verification`, `password-reset` | confirmação de endereço e recuperação de senha |
| `company-invitation`, `company-email-verification` | convite e confirmação empresarial |
| `project-invitation` | convite com projeto, papel e validade |
| `user-deletion` | aviso de exclusão, sem botão de ação |
| `registration-approved`, `registration-rejected` | resultado da análise de cadastro |
| `solar-model-approved` | aprovação de modelo de placa |

O corpo aceita um destinatário e usa `pt-BR` como idioma padrão. Também aceita `en-US` e `es-ES`. Nome e contexto adicional são validados pelo modelo escolhido. Os campos obrigatórios por modelo estão no contrato gerado, sem necessidade de enviar HTML, assunto ou remetente.

O limite do corpo é de 16 KiB. Campos desconhecidos são recusados. O `actionUrl` precisa ter origem exata na lista autorizada e não pode conter credenciais. HTTPS é exigido fora de desenvolvimento. A imagem opcional de modelo aceita HTTPS sem credenciais, mas não compartilha a restrição de origens do link de ação. O servidor não busca essa imagem.

## Exemplo de prévia

Este exemplo usa dados de demonstração e uma origem local que precisa estar autorizada na configuração.

```http
POST /emails/preview HTTP/1.1
Host: localhost:8083
X-Service-Key: <chave do chamador>
Content-Type: application/json

{
  "template": "email-verification",
  "locale": "pt-BR",
  "to": "usuario@example.com",
  "data": {
    "name": "Pessoa de exemplo",
    "actionUrl": "http://localhost:5173/pt-BR/verificar-email?token=exemplo"
  }
}
```

A resposta 200 contém `subject`, `html` e `text`. Para enviar a mesma mensagem, use o mesmo corpo em `POST /emails`. Em desenvolvimento, configure primeiro o Mailpit para capturar o envio. O passo a passo está em [RUNNING.md](./RUNNING.md).

## Erros

Os erros HTTP usam `application/problem+json`, com `errorCode`, `timestamp` e `requestId`, conforme o [contrato de erro](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERRORS.md). `errors` aparece em validação. O [catálogo central](https://github.com/Solierrr/docs-warehouse/blob/main/docs/standards/ERROR_CODES.md) descreve os códigos compartilhados e os específicos do serviço.

| Status e código | Quando ocorre |
|---|---|
| 400 `INVALID_ACTION_URL` | link fora das origens ou protocolos permitidos |
| 401 `UNAUTHENTICATED` | chave ausente ou inválida |
| 403 `FORBIDDEN` | chamador reconhecido, mas não autorizado pela rota |
| 413 `PAYLOAD_TOO_LARGE` | corpo acima do limite |
| 415 `UNSUPPORTED_MEDIA_TYPE` | conteúdo em formato não aceito |
| 422 `VALIDATION_FAILED` ou `MALFORMED_REQUEST` | corpo inválido ou JSON ilegível |
| 503 `EMAIL_SEND_FAILED` | falha durante renderização ou envio no caminho de envio |
| 500 `INTERNAL_ERROR` | falha inesperada não convertida pela rota |

O 503 de `/ready` é JSON com `status` igual a `DOWN`, sem o envelope de erro. O código `PAYLOAD_TOO_LARGE` já está no contrato deste serviço, mas ainda não consta no catálogo central analisado. Isso está registrado em [STATUS.md](./STATUS.md).
