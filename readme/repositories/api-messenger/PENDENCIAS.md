# Pendências do `api-messenger`

Dúvidas que o código não responde, ou em que o código diverge de uma decisão registrada. Cada uma tem a hipótese usada no texto. O dono responde e depois este arquivo sai.

## 1. Prazo para editar e apagar mensagem

- Onde aparece: `docs/OVERVIEW.md`, regras das mensagens, e `flows/MESSAGE_EDIT_DELETE.md`.
- O que o código mostra: o prazo vem de `MESSAGES_MUTATION_WINDOW`, com padrão de 30 minutos (`PT30M`). A decisão registrada no checklist fala em 15 minutos.
- Hipótese usada no texto: vale o padrão do código, 30 minutos, e o valor de cada ambiente é definido no Infisical.
- Resposta do dono: """ O tempo não importa, pois é decisão de negócio, porém o padrão alinhado foi de 30 minutos """

## 2. Avaliações no serviço

- Onde aparece: `docs/OVERVIEW.md`, avaliações, e `docs/STATUS.md`.
- O que o código mostra: as rotas `/messaging/ratings` e a coleção `rating` continuam no serviço. A decisão registrada diz que as avaliações saem daqui e ficam só no `api-core`, e o levantamento diz que nenhum cliente chama essas rotas.
- Hipótese usada no texto: as avaliações são documentadas como existem hoje, sem prazo de remoção.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "eu acho que é cabível remover avaliação do projeto". Decisão registrada: as avaliações saem do `api-messenger` e ficam só no `api-core`.

## 3. Comunidade ligada à equipe do projeto

- Onde aparece: `docs/OVERVIEW.md`, regras da comunidade, `docs/STATUS.md` e `flows/PROJECT_COMMUNITY.md`.
- O que o código mostra: a comunidade é criada por pedido do demandante do projeto, e membros e papéis são mantidos por pedidos ao próprio serviço. Não há consulta ao `api-core` além da checagem do demandante, nem papel `VIEWER`, nem conversa geral automática. A decisão registrada e o fluxo central `docs/flows/PROJECT_COMMUNITY.md` descrevem a comunidade criada com o projeto, sincronizada com a equipe a cada acesso, e quem sai do projeto saindo da comunidade.
- Hipótese usada no texto: o texto descreve o comportamento atual, e a sincronização com o projeto ainda não existe neste serviço.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "É", a comunidade nasce com o projeto e reúne a equipe e o cliente. A sincronização com o `api-core` fica como tarefa de implementação.

## 4. Autenticação das rotas internas

- Onde aparece: `docs/ARCHITECTURE.md`, integrações, `docs/API.md`, autenticação, e `docs/STATUS.md`.
- O que o código mostra: `/internal/**` é `permitAll`, sem token nem `X-Service-Key`. O levantamento do checklist fala em rota interna com token de serviço.
- Hipótese usada no texto: as rotas internas não têm autenticação de aplicação e dependem do Kong não publicar o prefixo `/internal`.
- Resposta do dono: Respondido em 2026-11-01: "OK, concordo plenamente". Toda rota interna exige a `X-Service-Key` de cada chamador, nenhuma depende só do gateway, e os caminhos legados saem quando os consumidores migrarem.

## 5. Aviso de mensagem nova para quem está desconectado

- Onde aparece: `docs/OVERVIEW.md`, regras das mensagens, e `docs/STATUS.md`.
- O que o código mostra: o aviso é um push pelo `api-notify`, ligado por `NOTIFY_BASE_URL`. A decisão registrada diz que o aviso vai ser por e-mail, e não há chamada ao `api-email`.
- Hipótese usada no texto: o aviso é o push pelo celular, e o e-mail não existe.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "email". O aviso por e-mail para quem está desconectado fica como tarefa de implementação, ao lado do push que já existe.
