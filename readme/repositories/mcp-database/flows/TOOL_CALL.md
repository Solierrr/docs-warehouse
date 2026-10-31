<p align="center">
  <img src="../assets/readme/banners/mcp.png" alt="mcp" width="100%">
</p>

# Chamada de ferramenta

O agente descobre o catálogo e executa uma ferramenta de leitura. O [fluxo de recomendações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RECOMMENDATION_FEED.md) descreve a origem dos rankings.

```mermaid
sequenceDiagram
 participant A as Agente
 participant M as Servidor MCP
 participant D as PostgreSQL ou motor de feeds
 A->>M: MCP com X-Service-Key
 M->>M: Valida chamador e argumentos
 M->>D: SQL parametrizado ou HTTP autenticado
 alt Fonte responde
 D-->>M: Dados
 M-->>A: Resultado e avisos
 else Falha de feed
 D-->>M: Erro
 M-->>A: Objeto com erro
 end
```

Chave inválida impede a chamada. Problemas de schema ou conexão afetam consultas diretas. A ausência de ranking não deve ser substituída por ofertas inventadas pelo agente.
