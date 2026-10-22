<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/k6.png" alt="k6" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Testes de carga

[![License](https://img.shields.io/github/license/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/infra-stress)](https://github.com/Solierrr/infra-stress/releases)

Este repositório reúne os testes de carga da plataforma, que simulam muitos acessos ao mesmo tempo para descobrir até onde o sistema aguenta. Há dois alvos prontos, a camada de borda que fica na frente do domínio principal e a aplicação web, cada um com um teste rápido de sanidade e um teste de estresse. Os testes são executados à mão, quando necessário, e este repositório não é um serviço no ar. As instruções de uso e os limites a respeitar estão nas seções abaixo.

## Detalhes técnicos

Testes de carga em [k6](https://k6.io/) escritos em TypeScript. Dois alvos prontos, o `web-worker` (Worker da Cloudflare na frente do domínio raiz) e o `web-app` (SPA estática), cada um com um smoke test e um stress test. O repositório não é um serviço: não tem imagem nem deploy, só é executado à mão.

## Como funciona

- `src/targets.json` lista, por alvo, a URL de cada ambiente (`local`, `qa`, `prod`). O `web-worker` não tem `qa` (o Worker só existe na rota de produção). `web-app` em `prod` e `web-worker` em `prod` apontam para o mesmo host, porque o web-app em produção é servido atrás do Worker.
- `src/config.ts` escolhe o perfil da execução a partir das flags do k6 (`-e TARGET`, `-e ENV`, ...) e aplica as travas: produção só roda com `CONFIRM_PROD=yes`, e o pico de usuários virtuais é menor onde o plano é gratuito (local 50, qa 20, prod 10; `PEAK_VUS` troca).
- `src/web-app.ts`: uma iteração é um carregamento de página (o HTML e os arquivos de `/assets/*` que ele referencia, descobertos uma vez no `setup()`). O `setup()` espera o host responder (o Render gratuito leva cerca de 30 s para acordar). Confere status 200 e que o HTML é o shell do SPA (`id="root"`); as rotas profundas só funcionam se o host reescrever para `index.html`, o que também é testado.
- `src/web-worker.ts`: confere o comportamento de borda. A página de manutenção (503 com `Retry-After: 60`) é um resultado esperado, não uma falha, porque a origem do cluster efêmero fica desligada de propósito; a métrica `origin_unavailable` mostra a fração de respostas 503.
- Os testes antigos, genéricos, continuam em `src/smoke/smoke.ts` e `src/stress/stress.ts` e leem os alvos de `src/urls.json` (veja abaixo).

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

## Estrutura

```
src/
  targets.json      # URLs por alvo e ambiente
  config.ts         # perfil da execução, travas e estágios do stress
  web-app.ts        # carregamento de página do SPA
  web-worker.ts     # checagens de borda do Worker
  smoke/            # web-app.ts, web-worker.ts e o smoke genérico
  stress/           # web-app.ts, web-worker.ts e o stress genérico
  https.ts          # lista de URLs do teste genérico
scripts/build.mjs   # esbuild: src/{smoke,stress}/*.ts -> dist/
```
