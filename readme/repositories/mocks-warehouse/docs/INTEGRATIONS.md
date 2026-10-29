<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudinary.png" alt="Cloudinary" width="100%">
</p>

# Integrações

## Mocks locais do web-app

Com os repositórios lado a lado:

```sh
npm run sync -- ../web-app
```

Copia o catálogo e as imagens para `web-app/public/images/mocks/`. O comando não altera código, não apaga arquivos e recusa sobrescrever conteúdo diferente. Arquivos iguais permitem repetir a sincronização. Se uma imagem existente precisar ser atualizada, revise e remova apenas esse arquivo antes de sincronizar novamente.

O consumidor deve ignorar essa pasta de cópia no Git. As referências atuais do web-app ainda precisam ser ligadas aos IDs deste catálogo; a sincronização sozinha não altera os dados mockados.

Um asset `images/enterprises/logos/K3M9QX.webp` vira `/images/mocks/enterprises/logos/K3M9QX.webp` no navegador. O catálogo copiado fica em `/images/mocks/manifest.json`.

## Seeds

Leia `manifest.json`, selecione os assets pelo `id` ou `category` e carregue o arquivo no caminho `path` relativo a este repositório. Envie o conteúdo para o armazenamento do ambiente e grave a URL resultante no banco. A escolha das entidades pertence ao seed; o envio dos arquivos para o Cloudinary é o comando acima.

Cada entrada contém `id`, `category`, `path`, `width`, `height`, `bytes`, `sha256`, `source.filename`, `description` e `tags`. O ID deriva do conteúdo original; o prefixo vem da categoria na importação e não muda quando a imagem é reclassificada. Preserve-o ao reotimizar o mesmo asset. O hash SHA256 valida o arquivo WebP distribuído. Nome original não implica fabricante, identidade ou permissão de uso; acrescente origem e créditos quando conhecidos.

## Cloudinary

O comando abaixo envia as imagens do catálogo para a cloud da plataforma, sem dependências. Cada arquivo sobe com `public_id = mocks/<id do manifest>` e `overwrite=false`, então repetir o comando não duplica nem sobrescreve nada. O catálogo é validado antes do envio.

```sh
npm run cloudinary -- --dry-run                       # lista o que seria enviado
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud> npm run cloudinary
npm run cloudinary -- --only units/hotel              # so uma categoria (prefixo)
```

As credenciais vêm só do ambiente e nunca são impressas. O seed do `database-console` monta as URLs a partir do mesmo `public_id` (`https://res.cloudinary.com/<cloud>/image/upload/mocks/<id>.webp`), então ele pode rodar antes do upload. O prefixo `mocks/` é ignorado pelas rotinas de exclusão de foto do `api-core`, para que apagar uma foto de um produto nunca destrua o asset compartilhado.

Testes do script: `npm test`.
