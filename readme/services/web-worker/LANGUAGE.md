<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# idioma e rotas

Para navegações HTML GET/HEAD, o Worker escolhe idioma pela URL, cookie `solaria_language`, `Accept-Language` (com pesos), ou `pt-BR`. Suporta `pt-BR`, `en-US` e `es-ES`. URLs sem idioma recebem redirecionamento 302 sem cache; prefixos não suportados são substituídos. APIs, arquivos, métodos de escrita e rotas isca permanecem fora dessa normalização.

O fallback 503 é autossuficiente, traduzido e oferece links de idioma. A preferência é salva em cookie de um ano, restrito ao host, `SameSite=Lax` e `Secure` em HTTPS. As rotas semânticas traduzem literais conhecidos e preservam IDs, slugs e query. Fragmentos são preservados pelo navegador; o seletor os mantém nos links.

O contrato portátil em `src/i18n/routing/` e os dicionários `src/i18n/locales/*/routes.json` são snapshots do web-app. Depois de alterar rotas ou idiomas, sincronize e confira com:

```bash
npm run language:sync -- --web-app ../web-app
npm run language:check -- --web-app ../web-app
```

O deploy usa o snapshot versionado e não precisa de um checkout do web-app. O web-app conserva a detecção equivalente para localhost e acessos sem Worker, incluindo o mesmo cookie. Rotas adicionadas também precisam de um padrão em `routing.data.ts` para serem traduzidas ao trocar idioma; parâmetros opacos não devem virar chaves de tradução.
