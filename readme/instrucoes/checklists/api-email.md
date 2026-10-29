# Checklist: `api-email`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-email (só leitura). A documentação é escrita em `readme/repositories/api-email/` deste repositório, numa branch `docs/api-email`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/CONTRACT.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".
- `docs/DEVELOPMENT.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: e-mails transacionais com modelos próprios; recebe JSON e `X-API-Key` (na [api-email#14](https://github.com/Solierrr/api-email/pull/14), aguardando revisão, passa a `X-Service-Key` com `SERVICE_KEY_API_CORE` e `SERVICE_KEY_API_AUTH`, aceitando o `X-API-Key` só enquanto `EMAIL_API_KEY` existir; Swagger em `/docs`, contrato em `/openapi.json`).
- Externos: SMTP. Usa o `lib-web` empacotado em `vendor/solierrr-web-lib-0.1.0.tgz` para os modelos.
- Chama: nenhum serviço.
- Chamado por: `api-core` (convite de projeto) e `web-sandbox`.
- Ambientes: QA ⚠️ (serviço criado, faltam `EMAIL_API_KEY`, `EMAIL_FROM` e `SMTP_*`); PROD ❌ (sem release, sem aplicação no `infra-gitops`, sem segredo no Terraform, sem `PROD` no `environment-status`).
- Lacunas: `api-auth` e `api-messenger` ainda não usam; chave única em vez de uma por serviço; provedor SMTP fora do local não escolhido; histórico de envios proposto e não criado.

## Decisões do dono já tomadas

Não perguntar de novo. Usar no texto como estão.

- O serviço é propositalmente enxuto, com poucas rotas e poucos modelos.
- O histórico de envios está planejado numa coleção do Mongo (`email_deliveries`), ainda não criada.
- Novas tentativas de envio são uma pendência que o dono vai decidir.
- O serviço vai para produção.

## Checklist

- [ ] Branch `docs/api-email` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `npm` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `SEND_EMAIL.md`, `PREVIEW_EMAIL.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento MONGO (histórico planejado, email_deliveries).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-email repository` aberta para a `main`, sem merge, e o link enviado ao dono.
