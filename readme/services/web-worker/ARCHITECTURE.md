<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Arquitetura do Repositório

O `web-worker` é um Cloudflare Worker em TypeScript que roda na frente do domínio raiz da plataforma. Ele recebe cada requisição antes da aplicação, aplica a escolha de idioma e a proteção por rotas isca, encaminha o pedido à origem num hostname separado e, quando a origem falha ou não responde, devolve uma página de indisponibilidade própria, com status 503. Não há servidor, container nem banco: o estado fica em recursos da Cloudflare.

- **Ponto de entrada (`src/index.ts`):** define a ordem das etapas e o repasse à origem.
- **Idioma (`src/i18n/` e `src/language-switcher/`):** decide o idioma pela URL, pelo cookie, pelo navegador e por um padrão, e normaliza apenas navegações HTML.
- **Rotas isca (`src/honeypot/`):** respondem 404 e adicionam o IP a uma lista da Cloudflare que aplica desafio; uma tarefa agendada remove os bloqueios vencidos.
- **Página de indisponibilidade (`src/unavailable*.ts`):** autossuficiente e traduzida, sem depender do cluster.
- **Telemetria (`src/telemetry.ts`):** envio opcional de logs e spans ao coletor de observabilidade.
- **Sincronização (`scripts/`):** copia do `web-app` as rotas, os idiomas e a lista de iscas, e confere se estão em dia.
- **Configuração (`wrangler.jsonc`):** rota, variáveis, tarefas agendadas e observabilidade; os segredos ficam no Wrangler.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── scripts/
│   ├── sync-honeypot-paths.mjs
│   └── sync-language-routing.mjs
├── src/
│   ├── honeypot/
│   ├── i18n/
│   ├── language-switcher/
│   ├── env.ts
│   ├── index.ts
│   ├── telemetry.ts
│   └── unavailable.ts
├── .dev.vars.example
├── Makefile
├── package.json
├── wrangler.jsonc
└── README.md
```
