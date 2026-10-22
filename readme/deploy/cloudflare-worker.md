<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
</p>

# Deploy de um Worker na Cloudflare

README reutilizável. Um Worker roda na borda da Cloudflare, na frente da aplicação, e é publicado pelo `wrangler`. Diferente dos serviços de aplicação, **não há imagem Docker, `Dockerfile` nem workflow de imagem**: o código TypeScript é empacotado e publicado direto pela Cloudflare. O exemplo é o `web-worker`, que atende o domínio raiz da plataforma.

## Como é publicado

1. A mudança entra em `main` por Pull Request, depois do CI.
2. O deploy é feito pela integração do GitHub com a Cloudflare: o repositório não precisa de workflow de deploy próprio.
3. O comando equivalente, para quem precisa publicar à mão, é `npm run deploy` (`wrangler deploy`).

## O que define o deploy

Tudo fica no `wrangler.jsonc` da raiz:

- `name` e `main`: o nome do Worker e o ponto de entrada (`src/index.ts`).
- `routes`: o padrão de URL que o Worker atende (`solarianetwork.site/*`) e a zona.
- `vars`: variáveis não secretas, como o host de origem e o tempo de vida dos bans.
- `triggers.crons`: tarefas agendadas (a limpeza de bans roda às 00:00 e 16:00 UTC).
- `observability`: logs do Worker ligados.

Segredos (token da Cloudflare, autenticação do coletor) **não** vão no `wrangler.jsonc`: use `wrangler secret put <NOME>`. Para rodar local, copie `.dev.vars.example` para `.dev.vars`, que não vai para o Git.

## Antes de publicar

```bash
npm install
npm test
npm run check
```

`npm run check` faz um `wrangler deploy --dry-run`: empacota e valida o Worker sem publicar. Quando o Worker depende de dados copiados de outro repositório (rotas e idiomas do `web-app`, lista de iscas do honeypot), rode também os comandos `*:check` do `package.json` para garantir que o snapshot está em dia.

## Requisito de DNS

A route só recebe tráfego se o registro DNS do domínio estiver **proxied** pela Cloudflare. A origem usa um hostname separado, fora da route, para o Worker não chamar a si mesmo.

## Ambiente no GitHub

O Worker não tem par de QA e produção, então o ambiente exibido no repositório é `ALIVE`, verificado por uma checagem HTTP da URL pública.

## Rollback

Reverta o commit em `main`; a integração publica a versão anterior. No painel da Cloudflare também é possível voltar a uma versão já implantada do Worker.
