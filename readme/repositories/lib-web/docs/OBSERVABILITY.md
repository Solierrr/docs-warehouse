<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/vite.png" width="100" hspace="8" alt="Vite" title="Vite">
</p>

# Observabilidade

A biblioteca traz o logger e a telemetria de navegador usados pelas aplicações `web-*`, em um só lugar. Os projetos importam, não copiam. Use o subcaminho `/observability`, que não carrega os estilos dos componentes.

```ts
import { initObservability, createLogger } from '@solaria.network/web-lib/observability'

initObservability({
  serviceName: 'web-app',
  environment: import.meta.env.MODE,
  endpoint: import.meta.env.VITE_OTLP_ENDPOINT,
  mode: import.meta.env.VITE_LOGS,
  propagateTo: [import.meta.env.VITE_API_URL],
})

const logger = createLogger(new URL(import.meta.url).pathname)
logger.info('mensagem')
logger.serviceError({ service: 'users', operation: 'list', status: 500, error })
```

- `createLogger(source)` escreve no console como antes (`[INFO] [source] mensagem`). `VITE_LOGS` controla o modo (`debug`, `activated` ou `deactivated`, sem diferenciar maiúsculas).
- Sem `endpoint`, só o console é usado. Com `endpoint` (o Collector, via OTLP/HTTP), os logs de nível `warn` e `error` (ajustável em `exportLevel`) vão para `/v1/logs`, em lote, e erros não tratados e rejeições são registrados.
- O `fetch` é instrumentado: cada chamada para a mesma origem ou para um destino de `propagateTo` recebe o cabeçalho `traceparent` e gera um span de cliente em `/v1/traces`, o que liga o clique do usuário ao trace do backend. A URL do span não leva query string.
- Mensagens e dados são limpos antes de sair: e-mail, CPF, CNPJ, JWT e `Bearer` viram `[redacted]`, e chaves como `password`, `token` e `authorization` também.
- O endpoint do Collector precisa estar exposto ao navegador com CORS restrito, token e limite de taxa. Nunca envie dado sensível.
- `npm test` roda os testes de unidade da pasta `src/observability`.
