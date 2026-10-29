<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# telemetria

Além dos logs do Cloudflare (`observability.enabled` em `wrangler.jsonc`), o Worker pode enviar logs e spans por OTLP/HTTP para o OpenTelemetry Collector. Sem `OTLP_ENDPOINT` nada é enviado.

- `OTLP_ENDPOINT`: base do Collector (o Worker acrescenta `/v1/logs` e `/v1/traces`). O Collector precisa estar acessível pela internet, com autenticação.
- `OTLP_AUTH`: valor do cabeçalho `Authorization`. Configure como secret (`wrangler secret put OTLP_AUTH`).
- `DEPLOYMENT_ENVIRONMENT`: ambiente do recurso (padrão `prod`).
- Eventos enviados: `honeypot_hit` (trap, path, method e país; o IP e o user-agent ficam só nos logs do Cloudflare, nunca no OTLP), `origin_error` (resposta 5xx da origem) e `origin_unreachable`. Cada chamada à origem gera um span e leva o cabeçalho `traceparent`, o que liga o trace do Worker ao do Kong e dos serviços.
- O envio roda em `ctx.waitUntil`, então não atrasa a resposta, e a falha do Collector é ignorada.
