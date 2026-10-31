# Checklist: `api-notify`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-notify (só leitura). A documentação é escrita em `readme/repositories/api-notify/` deste repositório, numa branch `docs/api-notify`.

## O que já existe aqui

- Nada. A pasta `readme/repositories/api-notify/` ainda não existe e é criada nesta tarefa.

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: notificações push para o mobile: aparelhos por FID e token FCM, histórico paginado, não lidas e rota interna `/internal/**` com `X-Service-Key` por serviço chamador.
- Dados e externos: Mongo (`DB_MONGO_NOTIFY`), Firebase Cloud Messaging (`FCM_CREDENTIALS_BASE64`; por padrão o envio só vai para o log).
- Chama: `api-auth` (JWKS).
- Chamado por: ninguém. O repositório já prevê as chaves `SERVICE_KEY_API_MESSENGER` e `SERVICE_KEY_API_CORE`, mas os dois serviços não têm a chamada; o `mobile-app` não registra aparelho.
- Ambientes: QA ⚠️ criado no Render em 2026-10-24 (healthcheck `/actuator/health`, a trocar por `/actuator/health/readiness`), deploy falhando por falta de `DB_MONGO_URI`; PROD ✅ manifestos, Ingress e segredo com `/fcm`.
- Contrato: com a [api-notify#6](https://github.com/Solierrr/api-notify/pull/6) (piloto da padronização), Swagger em `/docs`, contrato em `/openapi.json` (sem a rota interna) e `openapi.yaml` exportado com a rota interna; erros de validação em 422.
- Lacunas: nenhum consumidor; sem release e sem imagem versionada; sem pasta no `docs-warehouse`; credenciais do FCM no Infisical não conferidas.

## Checklist

- [ ] Branch `docs/api-notify` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `springboot` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `DEVICE_REGISTRATION.md`, `NOTIFICATION_DISPATCH.md`, `NOTIFICATION_READ.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento MONGO (aparelhos e notificações).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-notify repository` aberta para a `main`, sem merge, e o link enviado ao dono.
