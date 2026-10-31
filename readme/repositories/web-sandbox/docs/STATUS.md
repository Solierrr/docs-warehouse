<p align="center">
  <img src="../assets/readme/banners/react.png" alt="react" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- `api-notify` já consta do catálogo compartilhado, resolvendo a ausência do checklist antigo.
- O portal já depende da biblioteca visual e possui backend de proxy.
- O proxy não suporta SSE ou WebSocket.
- Alguns destinos e cabeçalhos ainda usam contratos anteriores. A compatibilidade precisa de revisão. <!-- PENDENTE: 1 -->
- README e workflow divergem sobre a URL ativa. <!-- PENDENTE: 2 -->
- `/health` retorna o formato próprio do portal, e não o padrão organizacional de health.
