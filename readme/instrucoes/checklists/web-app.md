# Checklist: `web-app`

Tipo `cliente`. Repositório de origem em https://github.com/Solierrr/web-app (só leitura). A documentação é escrita em `readme/repositories/web-app/` deste repositório, numa branch `docs/web-app`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: aplicação web pública e operacional.
- Externos: Firebase (login federado e Firestore só para "digitando"), chave do Google Maps direto no front (`VITE_GOOGLE_MAPS_API_KEY`), API de câmbio (`VITE_EXCHANGE_API`).
- Chama: `api-auth`, `api-core`, `api-messenger` (REST e WebSocket), `ai-validation`.
- Chamado por: `web-worker` (origem).
- Ambientes: QA ✅ (a `qa` está 57 commits à frente, mas com a árvore igual à `main`); PROD ✅.
- Lacunas: chatbot em mock (`ai-assistant`), upload sem `ai-accessibility`, feeds sem `api-recommendation`, componentes locais em vez do `lib-web`, Maps direto no front em vez do `api-google`; branches de bump do `infra-gitops` (`chore/bump-web-app-3.3.0` a `3.5.0`) não integradas, enquanto o manifesto usa `:latest`.

## Checklist

- [ ] Branch `docs/web-app` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `react` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `LOGIN.md`, `PROPOSAL_TO_PROJECT.md`, `CHAT.md`, `PROFESSIONAL_SIGN_UP.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento FIRESTORE (indicador de digitação).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the web-app repository` aberta para a `main`, sem merge, e o link enviado ao dono.
