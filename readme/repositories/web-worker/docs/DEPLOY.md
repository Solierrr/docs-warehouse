<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

# Deploy

O Wrangler declara a rota https://solarianetwork.site e a origem https://origin.solarianetwork.site. A origem precisa ser diferente da rota pública, com DNS e TLS compatíveis. O procedimento comum está em [CLOUDFLARE_WORKER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/CLOUDFLARE_WORKER.md).

A publicação usa `npm run deploy` com acesso à zona Cloudflare. Configure segredos com Wrangler e mantenha snapshots versionados. O deploy não depende de checkout do aplicativo web.

O DNS público, o Ingress da origem e a regra WAF devem ser conferidos no ambiente. Os arquivos deste repositório não comprovam sua ativação. <!-- PENDENTE: 1 -->
