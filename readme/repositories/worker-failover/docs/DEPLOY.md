<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Deploy

O Worker atende a rota `solarianetwork.site/*` e repassa as requisições para a origem em `origin.solarianetwork.site`, que precisa ficar fora da rota pública e ter DNS e TLS próprios para que o Worker não chame a si mesmo. O script na Cloudflare tem o mesmo nome do repositório, `worker-failover`, como define o [`wrangler.jsonc`](https://github.com/Solierrr/worker-failover/blob/main/wrangler.jsonc).

A publicação é feita pelo workflow manual `Deploy`, que instala as dependências, roda os testes e executa `npm run deploy` com os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` do repositório. O token é criado pelo Terraform no `infra-platform`, e `npm run deploy` continua valendo para uma publicação feita da própria máquina. O procedimento comum aos Workers está em [CLOUDFLARE_WORKER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/CLOUDFLARE_WORKER.md).

O DNS público, o Ingress da origem e a regra do WAF que usa a lista do honeypot dependem do ambiente, e os arquivos deste repositório não comprovam que estão ativos. <!-- PENDENTE: 1 -->
