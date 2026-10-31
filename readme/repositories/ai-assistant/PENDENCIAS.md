<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# Pendências

## 1. Publicação e consumidores efetivos

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: API e A2A implementados, cliente web real em outro repositório e configuração de ambiente, mas sem comprovação operacional.
- Hipótese usada no texto: descrevem-se as capacidades da main e não a disponibilidade atual.
- Resposta do dono:

## 2. Memória e coordenação entre agentes

- Onde aparece: `docs/STATUS.md` e `database/`.
- O que o código mostra: nomes fixos de coleções, tarefas de fundo e locks locais, sem contrato Redis de memória no cliente consultado.
- Hipótese usada no texto: persistência e limitações são descritas sem presumir isolamento ou coordenação distribuída.
- Resposta do dono:
