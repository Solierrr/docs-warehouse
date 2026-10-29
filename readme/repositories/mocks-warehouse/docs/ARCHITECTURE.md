<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudinary.png" alt="Cloudinary" width="100%">
</p>

# Arquitetura do Repositório

O `mocks-warehouse` é um acervo de imagens organizado por categoria, com um catálogo em JSON que descreve cada arquivo. Não há serviço em execução: scripts em Node.js validam o catálogo, sincronizam as imagens com o Cloudinary e geram as entradas novas. Os consumidores (dados simulados do `web-app` e cargas de exemplo dos bancos) escolhem as imagens pelo catálogo, usando os atributos de cada uma.

- **Acervo (`images/`):** imagens em WebP, separadas em usuários, empresas, unidades e produtos, com limites de tamanho por categoria.
- **Catálogo (`manifest.json`):** uma entrada por imagem, com papel, categoria e atributos opcionais, como recorte e faixa etária aparente.
- **Validação (`scripts/validate.mjs`):** confere o catálogo contra os arquivos e as regras dos atributos.
- **Publicação (`scripts/cloudinary.mjs` e `scripts/sync.mjs`):** envia as imagens ao Cloudinary com as coordenadas de recorte.
- **Catálogo (`scripts/catalog.mjs`):** utilitários de leitura e escrita do catálogo.

## Estrutura do repositório

```text
├── .github/
├── images/
│   ├── enterprises/
│   ├── products/
│   ├── units/
│   └── users/
├── scripts/
│   ├── catalog.mjs
│   ├── cloudinary.mjs
│   ├── sync.mjs
│   └── validate.mjs
├── manifest.json
├── package.json
└── README.md
```
