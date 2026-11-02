<p align="center">
  <img src="./assets/readme/banners/mcp.png" alt="MCP" width="100%">
</p>

# Pendências

## 1. Contrato atual de dados e implantação

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: consultas com `fk_*`, variável de banco de negócio e referência antiga a papéis e schemas do console, enquanto o contrato atual de acesso foi alterado.
- Hipótese usada no texto: descreve-se a main como implementada, sem afirmar compatibilidade com banco e segredos implantados.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período. "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.
