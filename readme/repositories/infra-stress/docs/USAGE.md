<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/k6.png" alt="k6" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Como executar os testes

## Uso

```bash
make install
make doctor          # confere git, node, npm e k6

make smoke  TARGET=web-app    ENV=qa
make stress TARGET=web-app    ENV=qa PEAK_VUS=10
make smoke  TARGET=web-worker ENV=local        # wrangler dev em 127.0.0.1:8787
make smoke  TARGET=web-worker ENV=prod CONFIRM_PROD=yes
```

`BASE_URL=...` troca a URL do `targets.json`. Sem k6 instalado, use o do Docker: `make smoke TARGET=web-app ENV=qa K6="docker run --rm -i -v $(pwd)/dist:/dist grafana/k6" K6_SCRIPTS=/dist` (para alvo local, use `BASE_URL=http://host.docker.internal:5173`).

### Honeypot do web-worker

Rotas isca (`/wp-login.php`, `/.env`, `/phpmyadmin/`) respondem 404 sem chegar à origem, e **em produção cada acerto adiciona o IP de quem chamou à lista de bloqueio da Cloudflare** (Managed Challenge depois disso). Por isso o teste da isca é opt-in: `HONEYPOT=yes` roda só com `ENV=local` (com `HONEYPOT_MODE=MOCK` no `.dev.vars` do Worker) ou com `ALLOW_BAN=yes`.

### Limites a respeitar

Produção e QA são planos gratuitos (Cloudflare Workers com cota diária de requisições; Render com banda e CPU limitadas). O stress contra `prod` é curto e baixo de propósito; não aumente o `PEAK_VUS` sem avisar.

## Testes genéricos por lista de URLs

```bash
cp src/urls.example.json src/urls.json   # domínios e paths reais; ignorado pelo git
npm run test:smoke
npm run test:stress
```

O build copia o `urls.json` (ou o exemplo) ao lado de cada script compilado, e esses dois comandos rodam os testes genéricos.
