<p align="center">
  <img src="./assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Pendências

## 1. Estrutura dos valores Helm

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: valores base na raiz, produção sob gateway e comandos usando chart sem versão fixa.
- Hipótese usada no texto: descrevem-se os arquivos, sem afirmar que todas as opções de produção são aplicadas pelo consumidor atual.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
