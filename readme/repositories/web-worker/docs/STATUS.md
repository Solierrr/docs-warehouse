<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- Há roteamento por idioma, fallback traduzido, detecção de iscas, limpeza e telemetria opcional.
- A consistência de rotas e iscas depende de sincronização com o aplicativo.
- A limpeza da lista é periódica e não expira cada item exatamente no TTL.
- O funcionamento público depende de DNS proxied, origem com TLS e WAF externo, que precisam de confirmação. <!-- PENDENTE: 1 -->
