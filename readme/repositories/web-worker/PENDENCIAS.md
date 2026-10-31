<p align="center">
  <img src="./assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

# Pendências

## 1. Ativação da borda e proteção externa

- Onde aparece: `docs/OVERVIEW.md`, `docs/HONEYPOT.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: rota, origem separada e operações de lista, mas DNS, Ingress e regra WAF são definidos externamente.
- Hipótese usada no texto: descreve-se o comportamento configurado sem presumir que toda a infraestrutura esteja ativa.
- Resposta do dono:
