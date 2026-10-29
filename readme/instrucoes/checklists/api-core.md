# Checklist: `api-core`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-core (só leitura). A documentação é escrita em `readme/repositories/api-core/` deste repositório, numa branch `docs/api-core`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: domínio inteiro do produto.
- Dados e externos: Postgres `coredb`, Redis core, Cloudinary.
- Chama: `api-auth` (JWKS, `AUTH_BASE_URL` no `/dev/login`), `api-email` (`API_EMAIL_URL`, `API_EMAIL_KEY`, convite de projeto), `api-google` (`GOOGLE_REGISTRY_URL`, `REGISTRY_CONSUMER_TOKEN`, tradução durável de ofertas), `ai-validation` (`AI_VALIDATION_BASE_URL`, `VALIDATION_SERVICE_TOKEN`, desligado por `app.professional-validation.enabled=false`). Os três recebem também `X-Service-Key` com `SERVICE_KEY` desde a [api-core#96](https://github.com/Solierrr/api-core/pull/96), aguardando revisão.
- Chamado por: `web-app`, `mobile-app`, `web-sandbox`, `api-auth`, `api-messenger`, `ai-assistant` e `ai-operational` (`API_CORE_URL`, com o JWT do usuário).
- Ambientes: QA ✅; PROD ✅.
- Lacunas: no `prod` faltam `VALIDATION_SERVICE_TOKEN`, `AI_VALIDATION_BASE_URL`, `PROJECT_INTERNAL_KEY`, `API_EMAIL_URL`, `API_EMAIL_KEY`, `GOOGLE_REGISTRY_URL` e `REGISTRY_CONSUMER_TOKEN`; a validação profissional depende de rotas que o `ai-validation` não tem na `main`; nenhuma chamada ao `api-notify`; `/dev/login` ativo em todos os ambientes; maior divergência entre `qa` e `main` da organização (main +52, qa +14, 300 arquivos).

## Decisões do dono já tomadas

Não perguntar de novo. Usar no texto como estão.

- O uso do `api-email` para os convites de projeto está correto e continua.
- Pedidos, planos, assinaturas e cobranças são descritos como transações.
- Uma pessoa pode pertencer a mais de uma empresa, com cargos diferentes em cada uma.
- O profissional só aparece para os clientes depois que os documentos dele são aprovados.
- O fluxo principal é unidade consumidora e fatura, propostas, aceite, projeto e contrato executado por um técnico.
- O atalho `/dev/login` é provisório e vai ser revisto.

## Checklist

- [ ] Branch `docs/api-core` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `springboot` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `PROPOSAL_TO_PROJECT.md`, `PROFESSIONAL_VALIDATION.md`, `PROJECT_INVITE.md`, `MEDIA_UPLOAD.md`, `OFFER_TRANSLATION.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento POSTGRES (coredb), REDIS (cache de busca).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-core repository` aberta para a `main`, sem merge, e o link enviado ao dono.
