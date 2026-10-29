# Convenções deste repositório

O `docs-warehouse` guarda os padrões da organização, os templates, os assets e a documentação de cada repositório antes de ela ir para o repositório de origem. Estas são as regras para trabalhar aqui.

## Pastas

| Pasta | O que guarda |
|---|---|
| `docs/standards/` | os padrões normativos (OpenAPI, erros, versão, autenticação entre serviços, health, Storybook e documentação) |
| `docs/flows/` | fluxos que passam por mais de um repositório |
| `readme/repositories/<repo>/` | a documentação de cada repositório, já na forma final |
| `readme/services/` | repositórios fora do padrão novo (`elos-*` e `generic-template`) |
| `readme/running/`, `readme/deploy/`, `readme/bruno/`, `readme/infisical/` | textos comuns a vários repositórios, apontados por link |
| `assets/readme/` | catálogo central de banners e ícones |
| `templates/`, `github/` | modelos de arquivos e de workflows para copiar nos repositórios |
| `gallery/` | o site publicado no GitHub Pages |

## Fluxo de trabalho

- Toda mudança entra por Pull Request para a `main`, numa branch `tipo/descricao` (`docs/api-core`, `fix/broken-links`).
- Uma Pull Request por repositório documentado. Quem abre não faz merge. O dono revisa e mergeia.
- A documentação é escrita só aqui. Ninguém altera o repositório de origem para documentar. A cópia para o repositório é feita depois, pelo dono.
- Commits em inglês, minúsculos, no formato `tipo: descrição` (`docs: document the api-core flows`), sem escopo e sem nenhuma marca de ferramenta de IA (`Co-Authored-By`, "Generated with").

## Nomes

- Pastas em inglês e minúsculas.
- Documentos em `MAIUSCULAS_COM_UNDERLINE.md`, exceto `README.md`.
- Imagens em `minusculas-com-hifen.png`.
- Conteúdo em português.

## Assets centrais

Um arquivo de `assets/readme/banners/` ou `assets/readme/stacks/` nunca é renomeado nem apagado, porque há documentos apontando para ele. Para trocar a imagem, substitua o arquivo com o mesmo nome. Um asset novo entra no [catálogo](../assets/readme/README.md) na mesma Pull Request.

## Galeria

A galeria lê os READMEs de `readme/repositories/` para montar a stack de cada serviço. Ao criar ou remover um serviço, atualize `gallery/data/services.json`. Para rodar localmente, `cd gallery && npm ci && npm run dev`.
