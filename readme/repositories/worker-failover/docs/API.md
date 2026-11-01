<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Contrato de borda

Não há OpenAPI próprio. A interface é o tráfego HTTP do domínio público. O Worker preserva requisições encaminhadas à origem, exceto pelo ajuste de host e propagação do trace.

Navegações HTML podem receber 302 para normalizar idioma. Iscas recebem 404 local sem cache. Origem indisponível recebe HTML 503 com `Retry-After` e sem cache. Respostas de negócio válidas continuam sob o contrato da aplicação de origem.

O job agendado limpa entradas antigas da lista de proteção. A API da Cloudflare usa Bearer token de conta e a telemetria pode usar Authorization configurado como segredo. Nenhuma dessas credenciais é entregue ao visitante.
