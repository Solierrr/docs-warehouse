<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudinary.png" alt="Cloudinary" width="100%">
</p>

# Validação e automação

## Validar

Requer Node.js 24 ou superior. Não há dependências para instalar.

```sh
npm run validate
```

O comando verifica IDs, categorias, caminhos, arquivos sem entrada no catálogo, formato WebP, tamanho e hash SHA256. A CI executa a mesma validação.

## Automação

Mantidos os workflows gerais de PRs, limpeza e releases semânticas do template. Removidos publicação Docker, sincronização QA e configuração de dependências Docker. O pacote é privado e não é publicado no npm.
