# Checklist: `api-auth`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-auth (só leitura). A documentação é escrita em `readme/repositories/api-auth/` deste repositório, numa branch `docs/api-auth`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: identidade e sessão. Emite JWT RS256 de 15 minutos e refresh de 7 dias, publica `/.well-known/jwks.json`, login federado por Firebase, deeplink com PKCE para o mobile.
- Dados e externos: Postgres `authdb` (schema no `database-console`), Redis Upstash core (outbox, grupo `core-user-provisioner`), Firebase, SMTP próprio (`AUTH_SMTP_HOST`).
- Chama: `api-core` (`PERSISTENCE_BASE_URL`, `POST /internal/users`).
- Chamado por: todos os serviços que validam JWT (`JWT_JWK_SET_URI` nos Spring, `JWT_JWKS_URL` nos agentes, `jwt_jwks_url` no `api-google`), `web-app`, `mobile-app`, `/dev/login` do `api-core` e do `api-messenger`.
- Ambientes: QA ✅ (variáveis do Render `SPRING_FLYWAY_ENABLED=false`, `SERVER_PORT=10000`, Redis com TLS, OTEL desligado); PROD ✅.
- Lacunas: e-mails ainda por SMTP próprio em vez do `api-email`; o `api-google` espera uma rota de token do Calendar que não existe; 2FA e exclusão de conta pela metade (relatório de 2026-10-23); `qa` e `main` divergentes (main +37, qa +12, 90 arquivos).

## Decisões do dono já tomadas

Não perguntar de novo. Usar no texto como estão.

- A verificação em duas etapas é opcional e ainda vai ser implementada. Ela existe no código, mas sem rota.
- Os e-mails de confirmação e de redefinição de senha devem passar a sair pelo `api-email`. Hoje saem por SMTP próprio.
- O login federado aceita só contas Google e Microsoft.
- A exclusão de conta deve existir, seguindo a prática de mercado. Ainda não existe.

## Checklist

- [ ] Branch `docs/api-auth` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `springboot` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `SIGN_UP.md`, `LOGIN.md`, `FEDERATED_LOGIN.md`, `MOBILE_PKCE_LOGIN.md`, `TOKEN_REFRESH.md`, `PASSWORD_RECOVERY.md`, `EMAIL_CONFIRMATION.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento POSTGRES (authdb).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-auth repository` aberta para a `main`, sem merge, e o link enviado ao dono.
