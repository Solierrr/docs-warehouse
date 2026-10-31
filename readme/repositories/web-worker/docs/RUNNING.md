<p align="center">
  <img src="../assets/readme/banners/cloudflare-workers.png" alt="cloudflare-workers" width="100%">
</p>

# Execução local

Use Node.js capaz de executar testes TypeScript nativos, npm e Wrangler 4. A configuração não fixa a versão do Node no manifesto. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `make install` e `make dev`. O repositório não configura `make vault`. Variáveis locais podem ficar em `.dev.vars`, seguindo o exemplo sem copiar credenciais.

| Comando | Efeito |
|---|---|
| `make test` | Testes Node |
| `make build` | Dry run do Wrangler |
| `make lint` | Não tem comando configurado |
| `npm run language:check -- --web-app ../web-app` | Confere snapshot de rotas |
| `npm run honeypot:check -- --web-app ../web-app` | Confere snapshot de iscas |

Os comandos `language:sync` e `honeypot:sync` atualizam os snapshots. O modo de inclusão simulada só é aceito em tráfego local. No ambiente publicado, o endereço real fornecido pela borda continua sujeito à operação configurada.
