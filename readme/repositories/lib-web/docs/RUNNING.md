<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Execução local

Use Node.js 24 ou superior e npm 11 ou superior, conforme o manifesto. O guia comum está em [TYPESCRIPT.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/TYPESCRIPT.md).

Execute `make install`. `make vault` exporta `/vite` quando necessário ao desenvolvimento. O build gera tokens, branding de e-mail, módulos, tipos e assets.

| Comando | Efeito |
|---|---|
| `make test` | Vitest |
| `make lint` | ESLint e typecheck |
| `make build` | Constrói `dist/` |
| `npm run pack:check` | Mostra o conteúdo do pacote sem publicar |
| `npm run storybook` | Catálogo local na porta 6006 |
| `npm run test:observability` | Testes Node da entrada de observabilidade |

Para conferir um consumidor local, construa e gere um tarball com `npm pack`. A aplicação precisa instalar novamente o arquivo atualizado. Ela não lê automaticamente os fontes da biblioteca.
