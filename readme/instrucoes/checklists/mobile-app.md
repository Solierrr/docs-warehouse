# Checklist: `mobile-app`

Tipo `cliente`. Repositório de origem em https://github.com/Solierrr/mobile-app (só leitura). A documentação é escrita em `readme/repositories/mobile-app/` deste repositório, numa branch `docs/mobile-app`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: app Android.
- Chama: flavor `qa` → `api-auth`, `api-core`, `api-messenger` e `google-registry` no Render; flavor `prod` → `api-auth`, `api-core` e `api-messenger` em `*.solarianetwork.site`.
- Ambientes: APK, release `v0.2.0`, sem deploy contínuo.
- Lacunas: push pelo `api-notify` não existe (sem FCM no app); `api-google` sem endereço em PROD; o README ainda diz que a integração com as APIs não foi feita, o que contradiz a PR #26 (login PKCE e QA): atualizar a documentação.

## Checklist

- [ ] Branch `docs/mobile-app` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `kotlin` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `LOGIN.md`, `MAIN_NAVIGATION.md`, `CHAT.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` não se aplica, a menos que o código mostre um banco próprio. Nesse caso, documentar e registrar no `PENDENCIAS.md`.
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the mobile-app repository` aberta para a `main`, sem merge, e o link enviado ao dono.
