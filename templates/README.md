# Templates

Escolha o tipo do repositório antes de copiar os modelos. A matriz indica quais
arquivos manter conforme o runtime, as variáveis usadas e os ambientes de deploy.
Copie apenas os fragmentos aplicáveis ao tipo escolhido.

## Matriz por tipo

| Tipo | Dockerfile e .dockerignore | entrypoint | http/ | .env.example | release.yml de imagem | qa-sync |
|---|---|---|---|---|---|---|
| A. Serviço de aplicação, QA no Render e PROD no GKE | Sim, para a imagem de PROD | Só quando o Render lê o Infisical na partida (`entrypoint.sh` ou `render-entrypoint.sh`) | Só nas APIs com coleção do Bruno | Sim, quando lê variáveis | Sim | Sim |
| A'. Serviço de aplicação só com QA por enquanto | Sim, se o runtime do Render for `docker`; com `python` nativo, o `Dockerfile` só serve se houver imagem de PROD | Mesma condição do tipo A | Mesma condição do tipo A | Sim | Só com imagem de PROD | Sim |
| B. Serviço independente no Render (`main`) | Só se o runtime for `docker` | Não | Não | Só se lê variáveis | Não | Não |
| C. Cloudflare Worker | Não | Não | Não | `.dev.vars.example` no lugar do `.env.example` | Não, pois não há imagem | Não |
| D. Job ou imagem no GKE sem QA | Sim | Não | Não | Sim | Sim | Não |
| E. Biblioteca | Não | Não | Não | Só se a biblioteca lê variáveis | Não; publica pacote | Não |
| F. Dados e scripts sem deploy | Não | Não | Não | Só se o script lê variáveis | Não | Não |
| G. Infra declarativa | Não | Não | Não | Só se lê variáveis | Não | Não |
| H. Documentação e templates | Não | Não | Não | Não | Não | Não |
| I. Placeholders ainda sem código | Não até haver código | Não | Não | Não até haver código | Não | Não |

`release.yml` nesta matriz é o workflow de publicação de imagem.

## Como adaptar o generic-template

O `generic-template` continua completo de propósito: contém `Dockerfile`,
`.dockerignore`, `entrypoint.sh`, `http/`, `.env.example` e `release.yml`. Essa é
a exceção ao tipo H: o molde guarda os arquivos para atender aos diferentes tipos.

Ao criar um repositório a partir dele, escolha uma linha da matriz e remova depois
os arquivos que o tipo não usa. Nos itens condicionais, mantenha o arquivo apenas
quando o runtime, as variáveis ou o deploy real justificarem seu uso. O
`generic-template` mantém todos esses arquivos; a adaptação acontece no
repositório novo.

Regras comuns ao adaptar:

- Mantenha `.dockerignore` apenas junto de um `Dockerfile` real.
- Mantenha `.env.example` apenas quando houver variáveis a documentar e preencha
  seus nomes e exemplos; não deixe o arquivo vazio nem versione segredos.
- No tipo C, use `.dev.vars.example` em vez de `.env.example`.
- Mantenha `qa-sync.yml` apenas quando existir a branch `qa`.
- Use `Makefile` apenas em repositórios de código.

Os modelos de imagem ficam em [`docker/`](./docker/README.md), o cliente HTTP em
[`http/`](./http/README.md), o Makefile em [`make/`](./make/README.md) e os
workflows em [`github/workflow/`](../github/workflow/README.md).
