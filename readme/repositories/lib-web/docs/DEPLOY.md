<p align="center">
  <img src="../assets/readme/banners/storybook.png" alt="Storybook" width="100%">
</p>

# Publicação

O workflow [npm-publisher](https://github.com/Solierrr/lib-web/blob/main/.github/workflows/npm-publisher.yml) roda em push na main. Ele consulta a versão do manifesto e só publica se ela ainda não existir. Antes, executa lint, typecheck, build e conferência do pacote. A publicação usa `NPM_TOKEN` e provenance.

O processo comum está em [PACKAGE_RELEASE.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PACKAGE_RELEASE.md). A versão é mantida pelo release-please. O pacote é público no registro npm.

O workflow Storybook publica `storybook-static` em Pages e registra a URL de saída no ambiente STORYBOOK. A URL atual e a adoção das versões pelos consumidores precisam de confirmação. <!-- PENDENTE: 1 -->
