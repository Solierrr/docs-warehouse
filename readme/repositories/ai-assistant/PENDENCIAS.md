<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Pendências

## 1. Publicação e consumidores efetivos

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: API e A2A implementados, cliente web real em outro repositório e configuração de ambiente, mas sem comprovação operacional.
- Hipótese usada no texto: descrevem-se as capacidades da main e não a disponibilidade atual.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 2. Memória e coordenação entre agentes

- Onde aparece: `docs/STATUS.md` e `database/`.
- O que o código mostra: nomes fixos de coleções, tarefas de fundo e locks locais, sem contrato Redis de memória no cliente consultado.
- Hipótese usada no texto: persistência e limitações são descritas sem presumir isolamento ou coordenação distribuída.
- Resposta do dono: Respondido em 2026-11-01: "OK, concordo plenamente, só siga o padrão de nomenclatura para collections". Cada agente é dono da própria coleção, sem compartilhar fatos, e os fatos ficam até a exclusão da conta. Nomes em inglês, snake_case e plural, no banco `dbagents`.
