<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
</p>

# Modelos de e-mail

## E-mails

Use `EmailLayout`, `EmailText` e `EmailAction` da entrada `@solaria.network/web-lib/email`, com React e react-email instalados. O layout recebe locale/title/footer/children; a ação recebe href/label/fallback. Essa entrada funciona no servidor sem carregar a raiz de browser ou style.css.

Os componentes de e-mail usam estilos inline com valores resolvidos dos mesmos tokens do site. `src/tokens/tokens.json` é a fonte do tema; scripts/build-tokens.mjs gera o CSS. A entrada `@solaria.network/web-lib/tokens` exporta theme/designTokens sem carregar componentes. A fonte de e-mail usa Arial para compatibilidade. Não há hooks, canvas, menus, SVG ou CSS externo nos e-mails.

Logo, título, mensagens, ações e rodapé ficam centralizados. O branding usa o SVG oficial src/assets/snowflake.svg como fonte; scripts/build-email-branding.mjs gera seu PNG transparente e as laterais estáticas do padrão Grid dos formulários. O build incorpora as imagens ao pacote. As laterais desaparecem em telas pequenas para preservar o espaço do conteúdo. Transporte Nodemailer deve configurar attachDataUrls=true para transformar essas imagens em partes CID incorporadas ao e-mail.

## Teste local com api-email

Na web-lib, sem publicar:

```sh
npm run build
npm pack --pack-destination ../api-email/vendor
```

No api-email:

```sh
npm install ./vendor/solaria.network-web-lib-0.3.1.tgz
npm run preview:seed
```

O tarball acompanha o consumidor para npm ci e Docker funcionarem sem uma pasta irmã. Ao editar o kit, gere o pacote novamente e reinstale-o no serviço; não existe leitura automática dos fontes da lib.
