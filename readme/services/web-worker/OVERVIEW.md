<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Visão geral e configuração

## Detalhes técnicos

Worker de borda para o domínio raiz `solarianetwork.site`. Ele encaminha as requisições para `origin.solarianetwork.site` e apresenta uma página temporária com status HTTP 503 quando a origem retorna erro 5xx ou não pode ser acessada.

O Worker não busca o próprio domínio público. A origem usa um hostname separado, fora da route `solarianetwork.site/*`, para evitar recursão.

## configuração necessária

- Mantenha o registro DNS do domínio raiz proxied pela Cloudflare para que a route do Worker receba as requisições.
- Faça `origin.solarianetwork.site` apontar diretamente para o origin do Kong, sem proxy da Cloudflare.
- Configure o Ingress do Web para aceitar `origin.solarianetwork.site` e emitir um certificado TLS para esse hostname. O Ingress atual aceita apenas `solarianetwork.site`.
- A route `solarianetwork.site/*` e o hostname de origem estão configurados em `wrangler.jsonc`.

O Terraform atual define o DNS do domínio raiz com `proxied = false`; ajuste-o para `true` antes de ativar a route. O registro wildcard DNS já cobre o hostname `origin` e permanece DNS-only.
