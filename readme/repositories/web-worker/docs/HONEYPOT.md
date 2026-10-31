<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

# Caminhos isca

Os caminhos vêm do snapshot de `robots.txt` do aplicativo e ficam em `src/honeypot/paths.json`. A correspondência usa prefixo normalizado.

A inclusão depende de `CF_API_TOKEN`, `CF_ACCOUNT_ID` e `HONEYPOT_LIST_ID`. Sem eles, a detecção continua respondendo localmente, mas não inclui o IP. IPv6 é reduzido a prefixo de 64 bits. Tentativas repetidas são deduplicadas por um minuto na instância.

O cron `0 */16 * * *` roda às 00h e 16h UTC. A idade mínima de remoção é configurável e a limpeza só remove itens marcados pelo honeypot. Portanto a duração real ultrapassa o TTL até a próxima execução. A regra WAF que consome a lista é configuração externa. <!-- PENDENTE: 1 -->
