<p align="center">
  <img src="../assets/readme/banners/cloudinary.png" alt="cloudinary" width="100%">
</p>

# Arquitetura

O catálogo `manifest.json` descreve arquivos em `images/`. Os scripts usam Node.js nativo, sem dependências de runtime.

```mermaid
flowchart LR
 I[WebP e manifesto] --> V[Validador]
 V --> S[Sincronização local]
 V --> U[Upload assinado]
 S --> W[Frontend]
 U --> C[Cloudinary]
 I --> D[Seed do database-console]
```

`scripts/catalog.mjs` valida o catálogo. `sync.mjs` copia ao frontend e `cloudinary.mjs` publica no armazenamento. O upload usa HTTPS com assinatura e credenciais de ambiente. Não há banco próprio. A integração com os consumidores está no [mapa central](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
