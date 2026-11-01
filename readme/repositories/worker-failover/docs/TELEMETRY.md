<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Telemetria

Os logs nativos são habilitados no Wrangler. A exportação OTLP é opcional por `OTLP_ENDPOINT`, com `OTLP_AUTH` como segredo quando exigido pelo destino.

São enviados eventos de isca e falha de origem, além de spans das chamadas à origem. O IP e o user agent do visitante ficam nos logs nativos e não são incluídos nesses eventos OTLP. Falhas de envio são ignoradas para manter a resposta da borda.

A proteção e a exposição do Collector pertencem à infraestrutura. O [mapa central](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md) contextualiza o percurso até a aplicação.
