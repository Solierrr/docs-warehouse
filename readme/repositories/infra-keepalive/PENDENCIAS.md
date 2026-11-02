<p align="center">
  <img src="./assets/readme/banners/render.png" alt="Render" width="100%">
</p>

# Pendências

As dúvidas dependem de configuração externa ao código. As hipóteses usadas na documentação estão identificadas nos trechos correspondentes.

## 1. Destinos efetivos do QA

- Onde aparece: `docs/OVERVIEW.md`, regras e limites, e `docs/STATUS.md`.
- O que o código mostra: o workflow importa `/service-urls` do ambiente `qa` e o script consulta variáveis com sufixo `_URL`. O repositório não lista os valores nem comprova a presença dos serviços de e-mail e notificações.
- Hipótese usada no texto: a inclusão desses serviços depende da configuração externa, sem afirmar que são consultados.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 2. Caminhos consultados

- Onde aparece: `docs/OVERVIEW.md`, regras e limites, `docs/ARCHITECTURE.md`, observabilidade e health, e `docs/STATUS.md`.
- O que o código mostra: o script passa cada URL diretamente ao `curl`, sem acrescentar um caminho ou validar o corpo. O padrão de health indica o caminho de liveness para esta rotina, mas as URLs efetivas não estão no repositório.
- Hipótese usada no texto: os caminhos dependem da configuração e o sucesso de uma consulta não comprova prontidão.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
