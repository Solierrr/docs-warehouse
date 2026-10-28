<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
</p>

# Avaliações e NPS

As avaliações (`Rating`) registram a nota de um usuário para um profissional ou um produto. O NPS (`Nps`) registra a nota de 0 a 10 que o usuário dá a uma conversa com o chatbot. As rotas ficam em [API.md](./API.md#avaliações-e-nps).

## Avaliações

`RatingService`.

| Operação | Regras |
|---|---|
| Criar | O avaliador é o usuário do JWT. Avaliar a si mesmo gera 422. `typeRate` é `PROFISSIONAL` ou `PRODUTO`. `rating` é um `BigDecimal` de 0.0 a 5.0. `comment` tem até 1000 caracteres. O status inicial é `ACTIVE`. |
| Ler por id, por avaliado ou por avaliador | Qualquer usuário autenticado e ativo lê qualquer avaliação. Não há filtro de status. |
| Editar | Só o avaliador. Um campo nulo mantém o valor atual. A edição não confere o status. |
| Alterar status | Só o avaliador. Aceita qualquer valor entre `ACTIVE`, `EXCLUDED` e `DOWN`, sem regra de transição. |

- A negação ao não avaliador é 403 com mensagem genérica.
- Não existe rota de exclusão. A retirada de uma avaliação é feita pelo status.
- A avaliação não guarda vínculo com conversa nem com projeto. O serviço não confere se `evaluatedId` existe no `api-auth` ou no `api-core`.

## NPS

`NpsService.create`.

1. A conversa precisa existir. Senão, 404.
2. O usuário precisa participar da conversa. Senão, 403 com mensagem genérica.
3. A conversa precisa ser `CHAT_BOT`. Senão, 422.
4. Cada conversa recebe um NPS só. Um segundo gera 409 `DUPLICATE_RESOURCE`. O índice único em `conversation_id` barra duas requisições simultâneas, e o serviço devolve o mesmo 409.

`classification` vem da nota:

| Nota | `classification` |
|---|---|
| 0 a 6 | `DETRACTOR` |
| 7 e 8 | `PASSIVE` |
| 9 e 10 | `PROMOTER` |

`environment` (`LOCAL`, `QA` ou `PROD`) é opcional e vem do cliente. O serviço não confere o status da conversa e não tem rota de leitura de NPS.
