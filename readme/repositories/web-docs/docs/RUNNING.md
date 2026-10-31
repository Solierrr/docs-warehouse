<p align="center">
  <img src="../assets/readme/banners/react.png" alt="React" width="100%">
</p>

# Execução local

Use Node.js 24, conforme `.node-version`, npm e `make`. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `make install` e `make dev`. O repositório não configura pastas para `make vault`.

| Comando | Efeito |
|---|---|
| `npm run typecheck` | Confere TypeScript |
| `make lint` | ESLint |
| `make build` | Compila, constrói e gera HTML de rotas |
| `npm run check` | Dry run de publicação do Wrangler |
| `make test` | Não tem comando configurado |

Abra uma rota `/documentos/<id>` e confira navegação, idioma e fallback. Um JSON inválido pode interromper o carregamento do catálogo. O tarball em `vendor/` precisa estar presente para `npm ci`.
