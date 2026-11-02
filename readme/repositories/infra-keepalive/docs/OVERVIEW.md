<p align="center">
  <img src="../assets/readme/banners/render.png" alt="Render" width="100%">
</p>

# Visão de produto

A rotina procura manter acessíveis os serviços de QA usados para validar a plataforma. Ela os consulta periodicamente para reduzir a hibernação do plano gratuito do Render e registra o resultado para quem acompanha o ambiente.

## O que a rotina faz

- Consulta os serviços cujos endereços estão configurados no ambiente de execução.
- Repete a consulta quando uma tentativa falha e passa ao próximo serviço mesmo depois de uma falha.
- Informa quantos serviços responderam e sinaliza a execução como falha se algum não responder.
- Permite iniciar um ciclo manualmente pelo GitHub, além do agendamento.

## Regras e limites

- A lista é definida pela configuração de QA e pode mudar sem alteração no script.
- Uma resposta aceita pela consulta conta como sucesso, sem verificar se todas as funções de um serviço estão prontas.
- O histórico da execução registra o resultado por serviço. A rotina não oferece tela própria nem mantém banco de dados.

Os serviços consultados fazem parte do ambiente de QA. A publicação desses serviços no Render é descrita no [processo de QA](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md).
