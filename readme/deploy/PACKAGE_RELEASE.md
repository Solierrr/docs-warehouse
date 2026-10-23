<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/npm.png" alt="npm" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/typescript.png" width="100" hspace="8" alt="TypeScript" title="TypeScript">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Publicação de pacotes

README reutilizável. Bibliotecas não são implantadas: elas são publicadas num registro de pacotes e os outros repositórios as instalam por versão. Não há `Dockerfile`, imagem nem ambiente de QA. O deploy aqui é a **release**.

| Biblioteca | Registro | Workflow |
|---|---|---|
| `lib-web` | npm | `npm-publisher.yml` |
| `lib-ai` | PyPI | `publish.yml` |

## Como funciona

1. Commits entram em `main` por Pull Request, com mensagens em Conventional Commits.
2. O release-please mantém aberta uma Pull Request de release que acumula as mudanças, calcula a versão (`feat` é minor, `fix` é patch, `!` ou `BREAKING CHANGE` é major) e atualiza o `CHANGELOG.md`.
3. Ao mergear essa Pull Request, o GitHub cria a release e a tag, e o workflow de publicação envia o pacote ao registro.

A Pull Request de release só deve ser mergeada depois que a mudança de código que ela contém tiver sido aprovada e integrada em `main`.

## Consumindo uma versão ainda não publicada

Para testar uma mudança da biblioteca antes da release, gere o pacote localmente e instale o arquivo no consumidor. No caso do `web-sandbox`, o tarball fica versionado em `vendor/`, o que evita depender de uma pasta irmã e de uma publicação. Esse atalho serve para desenvolvimento: a versão publicada no registro é a que vale quando a release sai.

## Segredos

O token do registro é guardado como secret do repositório (ou da organização) no GitHub e usado só pelo workflow de publicação. Nenhum token entra no código. Para a biblioteca que lê variáveis em runtime, como a `lib-ai`, valem as regras de [segredos e variáveis](../infisical/README.md).

## Rollback

Um pacote publicado não deve ser apagado do registro. Corrija com uma nova versão: reverta o commit em `main` e deixe o release-please publicar um patch. Os consumidores voltam fixando a versão anterior no gerenciador de pacotes.
