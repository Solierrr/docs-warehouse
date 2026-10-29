<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/cloudinary.png" alt="Cloudinary" width="100%">
</p>

# Acervo e catálogo

## Estrutura

```text
images/
  users/
    pfp/         suitman/ professionals/ staff/ clients/
    banners/     landscapes/ colors/ abstract/
  enterprises/
    pfp/                          (logos, ate 512 px)
    banners/     corporate/ construction/ industrial/ logistics/ hospitality/ retail/ solar/
  units/
    <segmento>/  main/ banner/ gallery/
  products/
    solar-panels/   hero/ demo/
    infrastructure/ hero/ gallery/
manifest.json
scripts/
```

Segmentos de unidade: cafeteria, supermercado, hortifruti, acougue, frigorifico, padaria, restaurante, farmacia, varejo, data-center, startup, industria, academia, hotel, posto. O papel `main` e a imagem principal, `banner` e horizontal e `gallery` e complementar. Principal e banner de unidade nao devem se repetir entre unidades; galeria pode.

As imagens são WebP, sem recortes, com transparência preservada quando presente. Logos têm até 512 pixels, banners até 1600 e demais categorias até 1200 no maior lado. Os originais fornecidos ficam fora do repositório.

## Atributos e recorte

Cada entrada do `manifest.json` pode ter `attributes` (opcional, validado em `npm run validate`):

- `gender`: `F`, `M` ou `NB`. Gênero aparente do retrato, só nos `users/pfp/*`, para o seed casar nome e foto. Não identifica a pessoa. Ausente quando indefinido.
- `age_range`: `18-34`, `35-54` ou `55+`. Faixa aparente e aproximada.
- `setting`: `indoor` ou `outdoor`.
- `has_text_or_brand`: `true` ou `false`.
- `crop`: `{ x, y, width, height }` em pixels da imagem do repositório. O `npm run cloudinary` envia como `custom_coordinates`, e o backend monta as variantes de avatar e banner com `g_custom`. Hoje os 86 retratos em `users/pfp/*` têm `crop` (detecção de rosto, com ajuste manual onde a detecção falhou).

## Adicionar imagens

Use uma pasta de categoria existente (por exemplo `products/solar-panels/hero` para foto principal com fundo branco e `demo` para demonstracoes), um nome aleatorio de seis caracteres maiusculos (letras e numeros, unico no repositorio) e formato WebP. A descricao do que a imagem mostra vai no campo `description`, e as palavras-chave em `tags`. Registre o asset no catálogo, preencha descrição, tags, dimensões, tamanho em bytes, hash do arquivo e nome original. Rode `npm run validate` antes de compartilhar a alteração. Não inclua ZIPs, credenciais ou duplicatas de imagens de outros repositórios.

## Licença

[Unlicense](https://github.com/Solierrr/mocks-warehouse/blob/main/LICENSE).
