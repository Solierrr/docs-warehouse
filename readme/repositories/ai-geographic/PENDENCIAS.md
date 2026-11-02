<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Pendências

## 1. Integração e publicação do copiloto

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: há contrato de conversa e configuração de QA. O checklist antigo questiona a continuidade do serviço e a integração no aplicativo.
- Hipótese usada no texto: descrevem-se capacidades implementadas sem afirmar que estão disponíveis no aplicativo ou em produção.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 2. Compartilhamento e retenção de memória

- Onde aparece: `database/MONGO.md`.
- O que o código mostra: banco e nomes de coleções fixos, índice de fatos por usuário e TTL de checkpoints.
- Hipótese usada no texto: a implementação é descrita sem afirmar isolamento entre agentes ou política de retenção dos fatos.
- Resposta do dono: Respondido em 2026-11-01: "OK, concordo plenamente, só siga o padrão de nomenclatura para collections". Cada agente é dono da própria coleção, sem compartilhar fatos, e os fatos ficam até a exclusão da conta. Nomes em inglês, snake_case e plural, no banco `dbagents`.
