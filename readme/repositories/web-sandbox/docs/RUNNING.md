<p align="center">
  <img src="../assets/readme/banners/react.png" alt="react" width="100%">
</p>

# Execução local

Use Node.js 24, conforme o Dockerfile, e npm. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `npm ci`, `npm run dev:server` com configuração autorizada de QA e, em outro terminal, `npm run dev`. O frontend usa a porta 5174 e encaminha `/api/qa` para o servidor local na 5180.

As variáveis Vite são URLs públicas e não devem conter chaves de serviço. `.env.local` não é carregado pelo processo Node. O `Makefile` não configura pastas para `make vault`.

| Comando | Efeito |
|---|---|
| `npm test` | Vitest do frontend e servidor |
| `make lint` | ESLint |
| `make build` | Compila frontend e servidor |
| `make test` | Não tem comando configurado, apesar do script npm existente |

Para testar o portal real, desative o mock de autenticação e use JWT de QA. Uma aba Swagger aberta sem o catálogo não recebe a sessão. Mantenha a aba original aberta durante a operação.
