<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Contrato de borda

O Worker não tem OpenAPI próprio, porque a sua interface é o tráfego HTTP do domínio público, e ele preserva as requisições encaminhadas à origem, exceto pelo ajuste de host e pela propagação do trace.

As navegações HTML podem receber 302 para normalizar o idioma, e as iscas recebem 404 local sem cache, enquanto uma origem indisponível gera um HTML 503 com `Retry-After`, também sem cache. As respostas de negócio válidas continuam seguindo o contrato da aplicação de origem.

O job agendado limpa entradas antigas da lista de proteção. A API da Cloudflare usa Bearer token de conta e a telemetria pode usar Authorization configurado como segredo. Nenhuma dessas credenciais é entregue ao visitante.
