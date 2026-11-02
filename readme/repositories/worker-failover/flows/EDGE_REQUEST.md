<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Requisição de borda

A requisição passa por iscas e idioma antes da consulta à origem. Falha de conexão, resposta 5xx ou 404 específico de rota ausente no Kong produz página temporária 503.

```mermaid
flowchart TD
 A[Requisição] --> B{Rota isca?}
 B -->|sim| C[404 local]
 B -->|não| D[Normaliza idioma]
 D --> E[Consulta origem separada]
 E --> F{Origem disponível?}
 F -->|sim| G[Repassa resposta]
 F -->|não| H[Página 503]
```

O contexto de entrada da plataforma está no [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md).
