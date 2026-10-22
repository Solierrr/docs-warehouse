<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudflare-workers.png" alt="Cloudflare Workers" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudflare.png" width="100" hspace="8" alt="Cloudflare" title="Cloudflare">
</p>

# Arquitetura de um Worker da Cloudflare

README reutilizável, usado como base do `ARCHITECTURE.md` dos Workers (hoje o `web-worker`). Um Worker roda na borda da Cloudflare, na frente da aplicação: ele recebe a requisição antes de qualquer servidor da plataforma, decide o que fazer com ela (redirecionar, bloquear, responder sozinho ou repassar à origem) e só então deixa a aplicação responder. Não há servidor, container nem banco próprio, e o estado, quando existe, fica em recursos da própria Cloudflare. Escreva o documento em português, em parágrafos corridos, com no mínimo 60 palavras na introdução e quatro bullets de decisões.

## O que descrever

- **Rota e origem.** Qual padrão de URL o Worker atende, para onde repassa a requisição e por que a origem usa um hostname separado (para o Worker não chamar a si mesmo).
- **Fluxo da requisição.** A ordem em que as etapas rodam. No `web-worker`: escolha de idioma, honeypot, repasse à origem e página de indisponibilidade quando a origem devolve 5xx.
- **Idioma.** A ordem de decisão (URL, cookie, `Accept-Language`, idioma padrão), quais requisições são normalizadas (só navegações HTML `GET` e `HEAD`) e o que fica de fora (APIs, arquivos e iscas).
- **Honeypot.** As rotas isca, como o IP é registrado na lista da Cloudflare, por quanto tempo vale o ban e qual tarefa agendada o remove. O ban é um desafio, nunca um bloqueio permanente.
- **Página de indisponibilidade.** Autossuficiente (sem depender do cluster), traduzida e com status 503.
- **Telemetria.** Logs do Worker e, opcionalmente, envio por OTLP ao coletor, sem dados pessoais.
- **Configuração.** Variáveis no `wrangler.jsonc` e segredos por `wrangler secret put` (ver [segredos e variáveis](../infisical/README.md)).
- **Dados copiados de outro repositório.** Snapshots (como as rotas e os idiomas do `web-app`) e o comando que os sincroniza e confere.

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

## Checklist antes de abrir o Pull Request

- A ordem das etapas do documento é a mesma do `index.ts`.
- Rotas excluídas do tratamento (APIs, arquivos, iscas) estão listadas.
- Nenhum token ou ID de conta aparece no texto.
- Os comandos `*:check` dos snapshots passam.

## Veja também

- [Deploy de um Worker na Cloudflare](../deploy/cloudflare-worker.md)
- [Segredos e variáveis](../infisical/README.md)
