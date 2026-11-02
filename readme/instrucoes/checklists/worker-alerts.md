# Checklist do `worker-alerts`

Repositório criado em 2026-10-31, já documentado na revisão de 2026-11-01.

## Contexto levantado

- Cloudflare Worker em TypeScript, com Hono e Zod, publicado em https://alerts.solarianetwork.site pelo workflow manual `Deploy`.
- Recebe os alertas do Grafana Cloud e abre, comenta ou registra o fim dos incidentes no Jira, nos quadros `DEV`, `DB` e `AI`.
- Heartbeat e sonda dos serviços principais a cada cinco minutos, com Durable Objects para os incidentes e o estado do monitor.
- E-mail dos incidentes P1 e P2 pelo `api-email`, com o modelo `operational-alert`.

## Feito

- [x] README, `docs/`, `flows/` e `PENDENCIAS.md`.
