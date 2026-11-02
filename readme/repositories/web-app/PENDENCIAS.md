<p align="center">
  <img src="./assets/readme/banners/react.png" alt="React" width="100%">
</p>

# Pendências

## 1. Disponibilidade das integrações por ambiente

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: clientes de assistentes, acessibilidade, mensagens e push, além de modos locais desativados em produção. O checklist antigo lista várias dessas integrações como ausentes.
- Hipótese usada no texto: capacidades implementadas são descritas sem afirmar que os ambientes estão configurados e disponíveis.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
