<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Executando localmente

O Worker roda na máquina com o Wrangler, e os testes rodam com o Vitest dentro do runtime de Workers, o que reproduz o ambiente da Cloudflare sem publicar nada. A rota de prévia permite ver o ticket que seria criado sem tocar no Jira.

## Pré-requisitos

É preciso ter o Node.js 24 e o npm, que instalam o Wrangler como dependência do projeto. Para mandar tickets de verdade a um quadro de testes, também é preciso ter as credenciais do Jira, mas a prévia e os testes funcionam sem elas.

## Variáveis

Para desenvolver, copie `.dev.vars.example` para `.dev.vars` e preencha o que for usar. As variáveis comuns, como o ambiente que gera ticket e os limites de 30 minutos e 8 tickets por dia, já ficam no `wrangler.jsonc`. Sem as variáveis do Jira, `POST /grafana` responde 503, e sem as do e-mail o envio de e-mail fica desligado.

## Comandos

```bash
npm ci
npm run dev
npm test
npm run typecheck
npm run check
npm run types
```

O `npm run check` valida o pacote com `wrangler deploy --dry-run` sem publicar, e o `npm run types` regera os tipos do Worker depois de uma mudança no `wrangler.jsonc`.

## Testando uma chamada

Com o Worker rodando, envie um webhook de exemplo para `POST /grafana/preview` com o token configurado no `.dev.vars`. A resposta mostra o título, as etiquetas, o quadro de destino e o corpo do ticket que seria criado, o que permite conferir um alerta novo antes de ligá-lo no Grafana.

## Tabela de rotas

Depois de mudar o destino de um serviço no `alerts.json` do repositório dele, rode `npm run routing:sync`, que lê a `main` de cada repositório pela CLI `gh` e grava o snapshot. O `npm run routing:check` falha se o snapshot estiver desatualizado, e é ele que roda no CI.
