<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Regras de comunidade

Uma comunidade (`ProjectCommunity`) é o espaço de conversa de um projeto técnico do `api-core`. Cada projeto tem no máximo uma. Os membros ficam embutidos no documento, cada um com um papel. As conversas da comunidade são subgrupos: conversas `GROUP` com `community_id`. As rotas ficam em [API.md](./API.md#comunidades). As regras de grupo que valem também para subgrupos ficam em [CONVERSATIONS.md](./CONVERSATIONS.md#gestão-de-grupo).

## Papéis

| Papel | Pode |
|---|---|
| `OWNER` | tudo o que o `ADMIN` faz, conceder `ADMIN` e arquivar a comunidade. Não pode ser removido nem sair. Não existe transferência de `OWNER`. |
| `ADMIN` | adicionar membros, mudar o papel de membros para `MEMBER`, remover outros membros (inclusive outro `ADMIN`), reativar a comunidade e ver todos os subgrupos. |
| `MEMBER` | ver a comunidade e os membros, criar subgrupos e ver os subgrupos de que participa. |

`CommunityPolicy` aplica essas regras: `requireMember`, `requireAdmin` (`OWNER` ou `ADMIN`) e `requireOwner`.

## Criar a comunidade

`CommunityService.createCommunity`.

1. `ProjectAuthorityClient.requireRequester` consulta o `api-core`. Só o demandante do projeto cria a comunidade. Uma recusa gera 403.
2. Se o projeto já tem comunidade, 409 `DUPLICATE_RESOURCE`. Numa criação simultânea, o índice único gera 409 `DATA_INTEGRITY_VIOLATION`.
3. `memberIds` é opcional. O serviço descarta nulos e o próprio criador. Os demais precisam estar ativos no `api-auth`, sem seleção parcial: um inexistente gera 404 e um inativo gera 403.
4. O criador entra como `OWNER` e os demais como `MEMBER`. O status inicial é `ACTIVE`.

A rota `requester-access` existe no `api-core` local na branch `feat/internal-requester-access`. Este documento não confirma se ela já está na `main`.

## Consultar

- `GET /me` lista as comunidades em que o usuário é membro.
- `GET /{id}` e `GET /project/{projectId}` exigem ser membro. Senão, 403.

## Arquivar e reativar

`CommunityService.updateCommunity`.

- `status` é obrigatório. Sem ele, 400.
- Arquivar (`ARCHIVED`) exige `OWNER`. Reativar (`ACTIVE`) exige `OWNER` ou `ADMIN`.
- Se o status já é o pedido, nada é gravado.
- A escrita usa CAS com até 3 tentativas.
- Se o status mudou, todos os participantes de todos os subgrupos recebem `CONVERSATION_UPDATED`.

Com a comunidade `ARCHIVED`:

- Ficam bloqueados: adicionar membros, remover outra pessoa, criar subgrupo, gerir subgrupo, enviar, editar ou excluir mensagem e iniciar digitando.
- Continuam permitidos: ler, alterar o estado pessoal, sair da comunidade ou do subgrupo e reativar.

## Adicionar membros ou mudar papel

`CommunityMembershipService.addMembers`.

- `role` padrão é `MEMBER`. `OWNER` nunca é atribuído por aqui: 400.
- Conceder `ADMIN` exige `OWNER`. Os outros papéis exigem `OWNER` ou `ADMIN`.
- A comunidade precisa estar `ACTIVE`. Senão, 422.
- Para quem já é membro, o serviço troca só o papel. O papel do `OWNER` nunca muda.
- Quem entra precisa estar ativo no `api-auth`, sem seleção parcial. Também não pode continuar em nenhum subgrupo da comunidade depois de uma saída anterior. Senão, 409 `MEMBERSHIP_CLEANUP_REQUIRED`.
- A escrita usa CAS com até 3 tentativas. Cada tentativa revalida o papel do ator e a ausência de restos em subgrupos. Se um membro que o serviço leu deixou de existir, 409.
- Esta operação não publica evento.

## Remover membro ou sair

`CommunityMembershipService.removeMember` e `CommunityGroupCascadeService`. A resposta é 204 e não traz a lista de membros, porque quem chamou pode ter acabado de sair.

Permissões, em `CommunityPolicy.requireRemovalAuthority`:

- O `OWNER` não pode ser removido: 422.
- Qualquer outro membro pode sair, mesmo com a comunidade arquivada.
- Remover outra pessoa exige ser `OWNER` ou `ADMIN` atual e comunidade `ACTIVE`.

Sucessores, no corpo opcional `successors`:

- Cada item precisa de `conversationId` e `successorUserId`. Conversa repetida gera 400.
- Cada item precisa apontar para um subgrupo em que o alvo participa, ou em que o sucessor já é o gestor. Senão, 400.
- Em cada subgrupo do alvo valem as regras de remoção de grupo: o alvo que é gestor precisa de sucessor, exceto quando é o único participante e outra pessoa o remove.
- Os sucessores precisam estar ativos no `api-auth`. Senão, 409 `SUCCESSOR_INELIGIBLE`.

O serviço valida o plano inteiro antes de qualquer escrita. Depois executa a cascata:

1. Passa a gestão de cada subgrupo em que o alvo é gestor para o sucessor indicado, com CAS por grupo. Um subgrupo que só tem o alvo, removido por outra pessoa, fica vazio.
2. Tira o alvo da comunidade, com CAS. A partir daqui o alvo já não acessa os subgrupos, porque a autorização exige ser membro da comunidade.
3. Envia `CONVERSATION_REMOVED` ao alvo para cada subgrupo.
4. Tira o alvo do roster de cada subgrupo, com CAS. Um subgrupo que fica vazio perde o gestor.

Ao final, se o alvo foi afetado, as sessões WebSocket dele são revogadas, e os participantes dos subgrupos afetados recebem `CONVERSATION_UPDATED`.

Uma falha técnica no meio da cascata gera 503 `REMOVAL_INCOMPLETE`. Repetir o `DELETE` continua de onde parou. Quando o alvo já saiu da comunidade mas sobrou em subgrupos, o serviço só faz a limpeza e ignora os sucessores. Ele bloqueia com 409 `GROUP_MANAGER_UNAVAILABLE` apenas se o alvo ainda for gestor de um subgrupo com outras pessoas.

## Subgrupos

### Criar

`ConversationCreationService.createCommunityGroupConversation`.

- O criador precisa ser membro (senão 403) e a comunidade precisa estar `ACTIVE` (senão 422).
- Sem `participantIds`, todos os membros são convidados.
- Convidados que não são membros vão para `rejectedParticipants`. Os demais passam pela mesma seleção parcial do grupo avulso.
- A transação de admissão confirma de novo que o criador e todos os participantes são membros e que a comunidade está `ACTIVE`.

### Listar

`CommunityService.listConversations` exige ser membro. `OWNER` e `ADMIN` veem todos os subgrupos. `MEMBER` vê só os que participa. A resposta traz metadados (`id`, `title`, `status`, `participantIds`, `managerUserId`, `startedAt`, `lastInteractionAt`), sem estado pessoal, da interação mais recente para a mais antiga.
