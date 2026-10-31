<p align="center">
  <img src="../assets/readme/banners/react.png" alt="react" width="100%">
</p>

# Deploy

O [Wrangler](https://github.com/Solierrr/web-docs/blob/main/wrangler.jsonc) configura https://docs.solarianetwork.site e publica `dist/` com tratamento de página 404. `workers_dev` está desligado. O serviço não depende do GKE.

A publicação é feita por `npm run deploy`, com autenticação e acesso ao domínio no Cloudflare. O procedimento comum está em [CLOUDFLARE_WORKERS.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/CLOUDFLARE_WORKERS.md).

O CI confere tipos e lint, mas não executa o build no workflow consultado. O workflow de ambiente consulta o domínio público. Configuração versionada não comprova disponibilidade ou aprovação dos textos. <!-- PENDENTE: 1 -->
