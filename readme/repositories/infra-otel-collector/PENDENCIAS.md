<p align="center">
  <img src="./assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Pendências

## 1. Coleta efetiva por ambiente

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: pipelines, Secret referenciado, stack local e Application de produção, sem execução ponta a ponta observada.
- Hipótese usada no texto: configuração é descrita sem afirmar que todos os serviços exportam ou que o backend recebe os sinais.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
