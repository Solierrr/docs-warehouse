<p align="center">
  <img src="./assets/readme/banners/postgresql.png" alt="postgresql" width="100%">
</p>

# Pendências

## 1. Política de backup e recuperação

- Onde aparece: `docs/OVERVIEW.md`, `docs/STATUS.md` e `docs/SECRETS_AND_BACKUP.md`.
- O que o código mostra: dumps locais manuais de core e auth, sem retenção externa ou restauração automatizada.
- Hipótese usada no texto: o utilitário produz cópias e não comprova uma política de recuperação implantada.
- Resposta do dono:

## 2. Consumidores após a troca de papéis

- Onde aparece: `docs/STATUS.md`.
- O que o código mostra: o contrato remove os papéis diretos de recomendações e MCP, enquanto outros repositórios ainda podem conter clientes SQL.
- Hipótese usada no texto: o contrato local é descrito sem presumir adoção completa nos consumidores.
- Resposta do dono:
