<p align="center">
  <img src="../assets/readme/banners/cloudinary.png" alt="Cloudinary" width="100%">
</p>

# Consumo de imagens

O sincronizador copia para `public/images/mocks/` do frontend. O destino deve ser ignorado pelo Git. Arquivos iguais permitem repetição e arquivos diferentes são recusados.

O seed lê o manifesto e escolhe imagens por categoria e ID. O upload Cloudinary usa um prefixo compartilhado e o ID do catálogo. A existência da URL montada pelo seed não comprova que o upload ocorreu. A proteção contra exclusão de assets compartilhados pertence ao `api-core`.
