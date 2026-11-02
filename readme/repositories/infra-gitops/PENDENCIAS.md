<p align="center">
  <img src="./assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

# Pendências

## 1. Estado operacional dos ambientes

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: estado desejado e catálogo de Applications, sem comprovação do estado atual do controlador e do cluster.
- Hipótese usada no texto: o inventário descreve configuração versionada e não afirma disponibilidade atual.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
