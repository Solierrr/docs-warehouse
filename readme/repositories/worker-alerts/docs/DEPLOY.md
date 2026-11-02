<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Deploy

O Worker é publicado na Cloudflare, no domínio próprio https://alerts.solarianetwork.site, com o endereço `workers.dev` desligado. Ele não tem ambiente de testes separado, porque só os alertas de produção viram ticket, e a rota de prévia cobre a conferência de um alerta sem efeito no Jira.

## Ambientes

| Ambiente | Onde roda | Como chega lá |
|---|---|---|
| Produção | Cloudflare, no script `worker-alerts` | workflow manual `Deploy`, que roda os testes e executa `npm run deploy` |

## Particularidades

- O domínio, os segredos do Worker e o token do webhook são criados pelo Terraform no `infra-platform`, a partir da pasta `/alerts` do Infisical, e o Worker não consulta o Infisical em execução.
- O workflow `Deploy` usa os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` do repositório, e o `npm run deploy` continua valendo para uma publicação feita da própria máquina.
- A origem do link do painel, definida em `ALERT_GRAFANA_URL`, precisa estar na lista de origens permitidas do `api-email`, senão o e-mail é recusado.
- O e-mail passa pelo cluster, por isso não sai enquanto o cluster está fora do ar, mas o ticket no Jira e o heartbeat não dependem dele.
- O procedimento comum aos Workers está em [CLOUDFLARE_WORKER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/CLOUDFLARE_WORKER.md).
