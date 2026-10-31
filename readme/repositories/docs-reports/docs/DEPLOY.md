<p align="center">
  <img src="../assets/readme/banners/html.png" alt="HTML" width="100%">
</p>

# Publicação

O [workflow da galeria](https://github.com/Solierrr/docs-reports/blob/main/.github/workflows/gallery.yml) valida PRs e publica a main no GitHub Pages. O ambiente do deploy se chama `PREVIEW` e recebe a URL retornada pelo serviço. A URL efetiva precisa de confirmação. <!-- PENDENTE: 1 -->

O build usa Node.js 24, instala as dependências com scripts de instalação desativados e publica `gallery/dist`. PRs não executam o job de publicação. A concorrência cancela execuções anteriores do mesmo grupo.

Os documentos são versionados em `documents/NNN/`. O script de commit confere estrutura, exige PDF, publica a branch do documento e abre a PR. Esse é o fluxo de publicação de relatórios do repositório de origem, separado da documentação aqui produzida. O [fluxo geral de release](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md) contextualiza as entregas da plataforma.
