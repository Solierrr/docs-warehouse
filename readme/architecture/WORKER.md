<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
</p>

# Arquitetura do Repositório

Um Worker roda na borda da Cloudflare, na frente da aplicação: ele recebe a requisição antes de qualquer servidor da plataforma, decide o que fazer com ela (redirecionar, bloquear, responder sozinho ou repassar à origem) e só então deixa a aplicação responder. Não há servidor, container nem banco próprio, e o estado, quando existe, fica em recursos da própria Cloudflare. O código é TypeScript, empacotado e publicado pelo `wrangler`.

- **Rota e origem:** o Worker atende um padrão de URL do domínio e repassa a requisição a uma origem num hostname separado, fora da rota, para não chamar a si mesmo.
- **Fluxo da requisição:** escolha de idioma, honeypot, repasse à origem e página de indisponibilidade quando a origem devolve 5xx ou não responde.
- **Idioma:** decidido pela URL, depois pelo cookie, pelo `Accept-Language` e por um idioma padrão. Só navegações HTML `GET` e `HEAD` são normalizadas; APIs, arquivos e iscas ficam de fora.
- **Honeypot:** rotas isca respondem 404 sem chegar à origem, e o IP entra numa lista da Cloudflare que aciona um desafio, nunca um bloqueio permanente. Uma tarefa agendada remove os bans vencidos.
- **Página de indisponibilidade:** autossuficiente, traduzida e com status 503, sem depender do cluster.
- **Telemetria:** logs do Worker e, opcionalmente, envio por OTLP ao coletor, sem dados pessoais.
- **Configuração:** variáveis no `wrangler.jsonc` e segredos por `wrangler secret put` (ver [segredos e variáveis](../infisical/README.md)).
- **Dados copiados de outro repositório:** as rotas e os idiomas do `web-app` e a lista de iscas são snapshots, sincronizados e conferidos por scripts do `package.json`.

## Estrutura típica

```text
├── .github/
├── docs/
├── scripts/               sincronização dos snapshots
├── src/
│   ├── honeypot/
│   ├── i18n/              contrato de rotas e dicionários
│   ├── language-switcher/
│   ├── env.ts
│   ├── index.ts           ponto de entrada do Worker
│   ├── telemetry.ts
│   └── unavailable.ts
├── Makefile
├── package.json
├── wrangler.jsonc
└── README.md
```

Não há `Dockerfile` nem `.env.example`: as variáveis locais ficam em `.dev.vars.example`.

## Veja também

- [Deploy de um Worker na Cloudflare](../deploy/CLOUDFLARE_WORKER.md)
- [Segredos e variáveis](../infisical/README.md)
