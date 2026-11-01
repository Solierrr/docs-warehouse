# Ambientes de preview

Os repositórios que têm algo para ver (componentes, e-mails, documentos, diagramas) publicam um ambiente de preview no GitHub Pages, todos do mesmo jeito. O portal de documentação (`docs.solarianetwork.site`) é a porta de entrada: lista os previews na aba Previews e serve cada um em `docs.solarianetwork.site/previews/<repositório>/`, com cópia guardada para o caso de o Pages cair.

| Repositório | Tipo | Preview |
|---|---|---|
| `api-email` | galeria | [solierrr.github.io/api-email](https://solierrr.github.io/api-email/) |
| `docs-reports` | galeria | [solierrr.github.io/docs-reports](https://solierrr.github.io/docs-reports/) |
| `docs-warehouse` | galeria | [solierrr.github.io/docs-warehouse](https://solierrr.github.io/docs-warehouse/) |
| `lib-web` | Storybook | [solierrr.github.io/lib-web](https://solierrr.github.io/lib-web/) |
| `web-app` | Storybook | [solierrr.github.io/web-app](https://solierrr.github.io/web-app/) |

## Regras

- **Casca única.** As galerias usam `@solaria.network/web-lib/gallery`: cabeçalho com o link para o portal de previews, menu lateral com busca, rodapé com repositório, versão e commit, tema claro e escuro e idiomas pt-BR, en-US e es-ES. O repositório só entrega o conteúdo. O Storybook usa o tema de manager de `storybookTheme` (ou, no `web-app`, o tema próprio com as mesmas cores e o logo apontando para o portal).
- **Estrutura.** `gallery/` na raiz, com `package.json` próprio e os scripts `typecheck` e `build` (saída em `dist/`). Quando precisa do código do projeto (`api-email`), importa por caminho relativo e o workflow usa `root-install` e `root-command`.
- **Caminhos relativos.** O build usa `base: './'` (Vite) ou os caminhos relativos padrão do Storybook, para funcionar em `<org>.github.io/<repositório>/` e no proxy do portal. Rotas por hash.
- **Branch e ambiente.** Publica só da `main`, no ambiente `PREVIEW`. A pull request roda typecheck e build, sem publicar.
- **Workflow.** Um `preview.yml` de poucas linhas chama o workflow reutilizável do repositório `.github` (`preview-gallery.yml` ou `preview-storybook.yml`), com os modelos em [`github/workflow/`](../../github/workflow/README.md). As permissões de escrita do Pages ficam no job que chama o workflow, não no nível do workflow (o SonarCloud reprova).
- **`gallery.json` na raiz.** `name` (igual ao do repositório), `kind` (`gallery` ou `storybook`) e `title` e `description` nos três idiomas. O `worker-docs` lê esse arquivo da `main` (`npm run previews:sync`) para montar a aba.
- **Conteúdo.** Sem o nome do projeto no código nem nos textos (só o domínio), sem travessão nem pontuação de texto gerado, imagens de exemplo do `mocks-warehouse` guardadas no repositório.
- **Template.** O `generic-template` traz a base pronta (`gallery/`, `gallery.json` e `preview.yml`); o workflow não roda se `gallery/package.json` não existir.

## Incluir um preview novo

1. No repositório: `gallery/` (ou Storybook), `gallery.json` e o `preview.yml`; habilitar o Pages no modo GitHub Actions e permitir a `main` no ambiente `PREVIEW`, se ele tiver regra de branch.
2. No `worker-docs`: o nome do repositório em `scripts/previews-repos.json`, `npm run previews:sync` e o `Deploy`.
3. Neste documento: a linha na tabela acima.
