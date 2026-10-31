# Checklist: `api-messenger`

Tipo `api`. Repositório de origem em https://github.com/Solierrr/api-messenger (só leitura). A documentação é escrita em `readme/repositories/api-messenger/` deste repositório, numa branch `docs/api-messenger`.

## O que já existe aqui

- `README.md`, no padrão antigo. Revisar contra o padrão novo, sem descartar o que estiver certo.
- `docs/ARCHITECTURE.md`, vindo da estrutura antiga. Reencaixar o conteúdo nos arquivos do padrão. Um arquivo que não cabe em nenhum deles fica com nome próprio em `docs/` e entra no "Aprofunde-se".

## Contexto conhecido

Levantamento de 2026-10-29. O código na `main` é a fonte. Se ele contradiz algo daqui, vale o código e a diferença vai para o `PENDENCIAS.md`.

- Finalidade: conversas diretas, comunidades de projeto, mensagens por REST e WebSocket, observabilidade das respostas do assistente, NPS e avaliações.
- Dados e externos: Mongo `solaria_messenger_db`.
- Chama: `api-core` (`PERSISTENCE_BASE_URL`, autoridade de projeto), `api-auth` (JWKS e `/dev/login`).
- Chamado por: `web-app` (`VITE_API_MESSENGER`, `VITE_WS_MESSENGER`), `mobile-app`, `web-sandbox`, `ai-assistant`, `ai-operational` e `ai-geographic` (`API_MESSENGER_URL`, rota interna com token de serviço).
- Ambientes: QA ✅; PROD ✅.
- Lacunas: nenhum cliente chama NPS e avaliações (decisão de remover as avaliações); aviso de mensagem nova por e-mail e por push não existe; `qa` e `main` divergentes (main +14, qa +8).

## Decisões do dono já tomadas

Não perguntar de novo. Usar no texto como estão.

- Qualquer pessoa pode iniciar uma conversa com qualquer outra a qualquer momento.
- A comunidade é criada com o projeto e reúne a equipe e o cliente. Membros e papéis vêm do projeto, e quem sai do projeto sai da comunidade e dos subgrupos.
- As avaliações saem do `api-messenger` e ficam só no `api-core`.
- Mensagens podem ser editadas em até 15 minutos, e a exclusão vira "mensagem apagada".
- O NPS do assistente é pedido ao fim da conversa.
- O aviso de mensagem nova para quem está desconectado vai ser por e-mail.

## Checklist

- [ ] Branch `docs/api-messenger` criada e publicada antes de começar a escrever.
- [ ] `README.md` no [padrão de README](../../../docs/standards/REPOSITORY_README.md), com banner sugerido `springboot` (confirmar no [catálogo](../../../assets/readme/README.md)) e os ícones confirmados no código.
- [ ] Banner e ícones copiados para `assets/readme/banners/` e `assets/readme/stacks/`.
- [ ] `docs/OVERVIEW.md`, a visão de produto.
- [ ] `docs/ARCHITECTURE.md`, a visão técnica, com o diagrama de componentes.
- [ ] `docs/RUNNING.md`, apontando o texto comum da stack em `readme/running/`.
- [ ] `docs/API.md`, apontando o `openapi.yaml` e o Swagger, sem copiar o contrato.
- [ ] `docs/DEPLOY.md`, se o repositório é publicado em algum ambiente, apontando o texto comum em `readme/deploy/`.
- [ ] `docs/STATUS.md`, se há limitação conhecida (as lacunas acima são um ponto de partida, conferidas no código).
- [ ] `flows/`, um arquivo por fluxo. Sugestões, a confirmar no código: `DIRECT_CONVERSATION.md`, `PROJECT_COMMUNITY.md`, `REALTIME_MESSAGE.md`, `ASSISTANT_MESSAGE.md`. Fluxos que passam por outros repositórios apontam para [`docs/flows/`](../../../docs/flows/README.md).
- [ ] `database/` montado a partir do schema real, com um arquivo para cada banco do repositório. Esperado pelo levantamento MONGO (conversas).
- [ ] Prints e imagens em `assets/`, com link relativo.
- [ ] `PENDENCIAS.md` com as dúvidas, e os trechos marcados com `<!-- PENDENTE: <número> -->`.
- [ ] Revisão de escrita feita pelo [padrão de escrita](../../../docs/standards/WRITING.md#revisão).
- [ ] Checklist final do [padrão de documentação](../../../docs/standards/DOCUMENTATION.md#antes-de-abrir-a-pull-request).
- [ ] Pull Request `docs: document the api-messenger repository` aberta para a `main`, sem merge, e o link enviado ao dono.
