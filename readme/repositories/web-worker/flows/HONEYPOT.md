<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Detecção de rotas isca

O caminho é normalizado, decodificado quando possível e comparado por prefixo sem distinguir caixa. Falhas ao registrar o IP não mudam a resposta local.

```mermaid
flowchart TD
 A[Caminho recebido] --> B{Corresponde à isca?}
 B -->|não| C[Segue roteamento]
 B -->|sim| D[Responde 404 sem cache]
 D --> E[Agenda inclusão em lista]
 E --> F[Limpeza periódica de entradas próprias]
```

O contexto de entrada da plataforma está no [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
