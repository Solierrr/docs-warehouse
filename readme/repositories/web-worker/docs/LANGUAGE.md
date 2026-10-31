<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

# Idiomas e snapshots

A preferência segue URL, cookie, `Accept-Language` com pesos e português padrão. A normalização atua apenas em navegação HTML GET ou HEAD e não altera métodos de escrita.

A preferência fica em cookie de um ano, restrito ao host, com `SameSite=Lax` e `Secure` em HTTPS. O contrato de rotas localizadas é copiado do aplicativo. Novas rotas precisam de sincronização e padrões de tradução, preservando parâmetros opacos.
