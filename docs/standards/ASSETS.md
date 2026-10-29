# Assets da documentação

Toda imagem que um documento usa fica dentro da pasta do próprio repositório, em `assets/`, e é referenciada por caminho relativo. Assim a pasta vai inteira para o repositório de origem sem ajuste de link.

## Onde fica cada coisa

| Tipo | Caminho | De onde vem |
|---|---|---|
| Banner e ícones de stack | `assets/readme/banners/` e `assets/readme/stacks/` | cópia do [catálogo central](../../assets/readme/README.md), com o mesmo nome |
| Prints de tela | `assets/screens/` | `web-sandbox`, `web-app` ou `mobile-app` rodando no QA ou local |
| Mocks e imagens de exemplo | `assets/mocks/` | [`mocks-warehouse`](https://github.com/Solierrr/mocks-warehouse) |
| Diagramas exportados, quando o Mermaid não serve | `assets/diagrams/` | gerados a partir de uma fonte que também fica no repositório |

## Regras

- O catálogo central em `assets/readme/` continua sendo a fonte dos banners e ícones. Um arquivo dele nunca é renomeado nem apagado, só substituído com o mesmo nome. A cópia em cada repositório é atualizada quando o central muda.
- Nome de arquivo em `minusculas-com-hifen.png`, dizendo o que a imagem mostra.
- PNG para print e ícone, SVG para diagrama exportado. Nada de `.jpg` no catálogo.
- Prints sem dado real de pessoa. Usar as contas e os dados de teste do QA ou os mocks.
- Toda imagem tem `alt` descritivo, sem o nome do projeto.
- Caminho relativo a partir do documento. No README é `./assets/...`, em `docs/` e `flows/` é `../assets/...`.
