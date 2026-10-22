<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/npm.png" alt="npm" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/fastify.png" width="100" hspace="8" alt="Fastify" title="Fastify">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Envio de e-mails automáticos

[![License](https://img.shields.io/github/license/Solierrr/api-email)](https://github.com/Solierrr/api-email/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-email)](https://github.com/Solierrr/api-email/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-email)](https://github.com/Solierrr/api-email/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-email)](https://github.com/Solierrr/api-email/releases)

Este serviço envia os e-mails automáticos da plataforma, como a confirmação de cadastro, a redefinição de senha e os convites para empresas e projetos. Os outros serviços pedem o envio a ele, que monta a mensagem pronta, no idioma certo, e a entrega ao servidor de e-mail. Também é possível ver uma prévia da mensagem antes de enviar. Ele não guarda histórico nem tenta reenviar por conta própria, então o aceite do servidor de e-mail não garante que a mensagem chegou à caixa de entrada de quem a recebe. As rotas e os modelos de mensagem estão descritos nas seções abaixo.

## Detalhes técnicos

Serviço interno de e-mails transacionais da plataforma em TypeScript/Node.js, com Fastify, React Email e Nodemailer. A API HTTP é reutilizável por Java/Kotlin e TypeScript.

## Contrato

| Método | Rota            | Autenticação | Resultado                                            |
| ------ | --------------- | ------------ | ---------------------------------------------------- |
| GET    | /health         | pública      | Processo HTTP em execução                            |
| GET    | /ready          | pública      | SMTP acessível; 503 se indisponível                  |
| POST   | /emails/preview | X-API-Key    | subject, html e text sem envio                       |
| POST   | /emails         | X-API-Key    | 200 com status accepted e messageId após aceite SMTP |

```json
{
  "template": "email-verification",
  "locale": "pt-BR",
  "to": "user@example.com",
  "data": {
    "name": "David",
    "actionUrl": "http://localhost:5173/pt-BR/verificar-email?token=example"
  }
}
```

Templates: email-verification, password-reset, company-invitation, project-invitation, user-deletion, registration-approved, registration-rejected, solar-model-approved e company-email-verification. Idiomas: pt-BR (padrão), en-US e es-ES. Nome opcional; convite e verificação corporativa exigem data.companyName, convite de projeto exige data.projectName, data.projectRole e data.invitationExpiresAt, aprovação de modelo exige data.modelName e reprovação exige data.reason. data.actionUrl é obrigatório, exceto no aviso de exclusão, que não exibe botão. Um destinatário por chamada. Campos desconhecidos, HTML/remetente arbitrários e links fora de EMAIL_ALLOWED_ORIGINS são rejeitados.

Exemplos editáveis ficam diretamente em preview/. Execute `npm run preview:seed` para refletir os nove payloads no Mailpit local. São templates para fluxos documentados do app; o disparo automático pelos serviços de origem ainda depende da integração desses serviços.

Erros: 400 INVALID_REQUEST/INVALID_ACTION_URL, 401 UNAUTHORIZED, 413 para corpo maior que 16 KiB, 503 EMAIL_SEND_FAILED. Erros não revelam credenciais, links ou detalhes SMTP; requestId identifica a chamada.

**accepted significa aceite SMTP, não entrega na caixa postal.** Envio síncrono sem fila, retry automático, histórico ou idempotência. Timeout pode ocorrer após aceite; repetir pode duplicar o e-mail. idempotencyKey não faz parte deste contrato.

## Consumidores

Auth continua gerando/validando tokens e construindo links. Core decide destinatários e regras de negócio. Eles chamam esta API com chave interna. Web-app e sandbox acionam Auth/Core/BFF, sem chave de serviço no navegador.

Java/Kotlin e TypeScript usam o mesmo JSON e header HTTP; o consumidor não precisa importar os templates. O backend consumidor configura EMAIL_SERVICE_URL e EMAIL_SERVICE_API_KEY.

## Desenvolvimento

Consulte [RUNNING.md](https://github.com/Solierrr/api-email/blob/main/docs/RUNNING.md), [ARCHITECTURE.md](https://github.com/Solierrr/api-email/blob/main/docs/ARCHITECTURE.md), [DEPLOYMENT.md](https://github.com/Solierrr/api-email/blob/main/docs/DEPLOYMENT.md) e [http/README.md](https://github.com/Solierrr/api-email/blob/main/http/README.md).

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run format:check
```
