<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/k6.png" alt="k6" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
</p>

# Como os testes funcionam

## Detalhes técnicos

Testes de carga em [k6](https://k6.io/) escritos em TypeScript. Dois alvos prontos, o `web-worker` (Worker da Cloudflare na frente do domínio raiz) e o `web-app` (SPA estática), cada um com um smoke test e um stress test. O repositório não é um serviço: não tem imagem nem deploy, só é executado à mão.

## Como funciona

- `src/targets.json` lista, por alvo, a URL de cada ambiente (`local`, `qa`, `prod`). O `web-worker` não tem `qa` (o Worker só existe na rota de produção). `web-app` em `prod` e `web-worker` em `prod` apontam para o mesmo host, porque o web-app em produção é servido atrás do Worker.
- `src/config.ts` escolhe o perfil da execução a partir das flags do k6 (`-e TARGET`, `-e ENV`, ...) e aplica as travas: produção só roda com `CONFIRM_PROD=yes`, e o pico de usuários virtuais é menor onde o plano é gratuito (local 50, qa 20, prod 10; `PEAK_VUS` troca).
- `src/web-app.ts`: uma iteração é um carregamento de página (o HTML e os arquivos de `/assets/*` que ele referencia, descobertos uma vez no `setup()`). O `setup()` espera o host responder (o Render gratuito leva cerca de 30 s para acordar). Confere status 200 e que o HTML é o shell do SPA (`id="root"`); as rotas profundas só funcionam se o host reescrever para `index.html`, o que também é testado.
- `src/web-worker.ts`: confere o comportamento de borda. A página de manutenção (503 com `Retry-After: 60`) é um resultado esperado, não uma falha, porque a origem do cluster efêmero fica desligada de propósito; a métrica `origin_unavailable` mostra a fração de respostas 503.
- Os testes antigos, genéricos, continuam em `src/smoke/smoke.ts` e `src/stress/stress.ts` e leem os alvos de `src/urls.json` (veja abaixo).

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
