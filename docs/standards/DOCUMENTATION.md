# Documentação dos repositórios

Todo repositório da organização tem a mesma documentação, na mesma estrutura. Ela é escrita primeiro aqui, em `readme/repositories/<repositório>/`, revisada por Pull Request e só depois copiada para o repositório de origem. Por isso a pasta de cada repositório já tem a forma final, com links relativos que continuam valendo depois da cópia.

Ficam fora os repositórios `elos-*`, o `generic-template`, o `.github` e o próprio `docs-warehouse`.

## Estrutura

```text
readme/repositories/<repositório>/
├── README.md
├── PENDENCIAS.md
├── docs/
│   ├── OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── RUNNING.md
│   ├── API.md
│   ├── DEPLOY.md
│   └── STATUS.md
├── flows/
│   └── <FLUXO>.md
├── database/
│   └── <BANCO>.md
└── assets/
    ├── readme/
    └── <imagens do repositório>
```

| Caminho | Obrigatório | Conteúdo |
|---|---|---|
| `README.md` | sempre | a central do repositório, no [padrão de README](./REPOSITORY_README.md) |
| `PENDENCIAS.md` | quando houver dúvida | perguntas para o dono responder; sai antes da cópia para o repositório |
| `docs/OVERVIEW.md` | sempre | a visão de produto |
| `docs/ARCHITECTURE.md` | sempre | a visão técnica |
| `docs/RUNNING.md` | sempre | como rodar e testar localmente |
| `docs/API.md` | quando o repositório expõe API, fila ou protocolo (MCP, A2A, eventos) | como chamar |
| `docs/DEPLOY.md` | quando o repositório é publicado em algum ambiente | onde roda e como chega lá |
| `docs/STATUS.md` | quando há limitação conhecida | o que funciona, o que falta e as dívidas |
| `flows/` | sempre, com pelo menos um fluxo | os fluxos do repositório, um arquivo por fluxo |
| `database/` | quando o repositório é dono de um banco, uma coleção ou um índice | o modelo de dados |
| `assets/` | quando há imagem | cópia de todo arquivo de imagem que os documentos usam |

Outro arquivo só entra em `docs/` quando o assunto não cabe em nenhum dos acima, como um protocolo próprio ou um catálogo de eventos. O nome segue a mesma regra de nomenclatura, e o arquivo entra no "Aprofunde-se" do README.

## Visão de produto e visão técnica

Os dois públicos leem documentos diferentes.

- O `OVERVIEW.md` é para quem não programa, como produto, design ou quem chegou agora. Ele explica para quem o repositório existe, que problema resolve, o que a pessoa consegue fazer com ele e quais regras de negócio valem. Mostra telas e fluxos de produto quando houver. Não cita classe, rota, tabela, variável nem comando.
- O `ARCHITECTURE.md` é para quem vai mexer no código. Ele explica as camadas, as pastas, as dependências, as integrações com outros serviços, a autenticação, os dados e as decisões técnicas com o motivo de cada uma.

Uma regra de negócio aparece no `OVERVIEW.md` como regra ("quem sai do projeto sai das comunidades") e no `ARCHITECTURE.md` como implementação (onde a cascata acontece e o que ela apaga).

## O que vai em cada arquivo

### `docs/OVERVIEW.md`

1. Para quem é e qual problema resolve.
2. O que dá para fazer, em frases curtas, uma por capacidade.
3. Regras de negócio, cada uma com o motivo quando ele for conhecido.
4. Onde o repositório aparece para o usuário (tela, app, e-mail, notificação), com imagem quando houver.
5. Relação com outras partes da plataforma, em linguagem de produto.

### `docs/ARCHITECTURE.md`

1. Visão geral em um parágrafo e um diagrama Mermaid de componentes (`flowchart`).
2. Estrutura de pastas, só as que importam, com o papel de cada uma.
3. Integrações, uma tabela com quem chama este repositório, quem ele chama, o protocolo e a autenticação (JWT, `X-Service-Key`, chave de provedor).
4. Dados, com o banco e um link para `database/`.
5. Decisões técnicas e o motivo de cada uma.
6. Observabilidade, health checks e versão, só o que é específico deste repositório.

### `docs/RUNNING.md`

1. Pré-requisitos, com versões.
2. Como obter as variáveis (`make vault`), sem nunca listar valores.
3. Comandos do `Makefile` (`make dev`, `make test`, `make lint`, `make openapi`).
4. Como testar uma chamada local (coleção Bruno, Swagger em `/docs`, tela).
5. Problemas conhecidos e como contornar.

O texto comum da stack fica em [`readme/running/`](../../readme/running/). O `RUNNING.md` do repositório traz só o que é dele e aponta o comum pelo link do `docs-warehouse`.

### `docs/API.md`

1. Como autenticar.
2. Onde está o contrato (`openapi.yaml` na raiz e `/docs` no QA). O contrato não é copiado para o Markdown.
3. Os grupos de rotas e para que servem, sem repetir parâmetro por parâmetro.
4. Erros específicos, com link para o [catálogo](./ERROR_CODES.md).
5. Exemplos de chamada para os casos principais.

Para fila, MCP, A2A ou eventos, a mesma ordem vale para mensagens, ferramentas ou eventos.

### `docs/DEPLOY.md`

1. Ambientes em que o repositório roda (local, QA no Render, PROD no GKE, Cloudflare, pacote publicado), com a URL de cada um.
2. O que é específico dele, como `healthCheckPath`, variáveis que só ele tem e passos manuais.

O processo comum fica em [`readme/deploy/`](../../readme/deploy/) e é apontado pelo link, não copiado.

### `docs/STATUS.md`

O que funciona, o que está incompleto, as dívidas técnicas e o que depende de outro repositório. Cada item tem data. Nada de roadmap ou promessa.

### `flows/`

- Um arquivo por fluxo, com nome no padrão de nomenclatura (`LOGIN.md`, `PASSWORD_RECOVERY.md`, `ASSET_UPLOAD.md`).
- Cada fluxo tem um parágrafo curto (quando acontece e qual o resultado), um diagrama Mermaid no [padrão de diagramas](./DIAGRAMS.md) e a lista dos casos de erro.
- Todo repositório tem fluxo, mesmo os que não são serviço. No `mocks-warehouse`, por exemplo, o fluxo de publicar um mock. No `lib-web`, o de lançar uma versão do pacote. No `infra-gitops`, o de levar uma imagem para produção.
- Fluxos que passam por vários repositórios ficam centralizados em [`docs/flows/`](../flows/). O repositório aponta para eles e descreve só a parte que é dele.

### `database/`

- Um arquivo por banco, coleção ou índice que o repositório é dono, como `POSTGRES.md`, `MONGO.md`, `FIRESTORE.md`, `QDRANT.md`, `REDIS.md` ou `NEO4J.md`.
- Cada arquivo traz o diagrama Mermaid `erDiagram` (ou a estrutura do documento, para bancos de documentos e vetores), a descrição de cada tabela ou coleção, os índices e quem lê ou escreve.
- A fonte é o schema real, ou seja, migrations, entidades, modelos e `schema.sql` do repositório. Os diagramas antigos de `database/` e `diagrams/` na raiz do `docs-warehouse` estão desatualizados e só servem de referência.
- Cada banco é documentado pelo repositório dono do domínio. Postgres de negócio no `api-core`, Postgres de autenticação no `api-auth`, coleções do Mongo de conversas no `api-messenger`. O `database-console` documenta o mapa geral, com quais bancos existem, quem é dono de cada um, acesso e backup.

### `PENDENCIAS.md`

Dúvidas de regra de negócio ou de decisão que o código não responde. Quem escreve não pergunta a ninguém durante o trabalho. Registra a dúvida aqui, escolhe a hipótese mais provável pelo código, escreve o documento com ela e marca o trecho com `<!-- PENDENTE: <número> -->`. O dono responde por cima e depois o arquivo sai.

```markdown
## 1. Quem pode apagar uma comunidade

- Onde aparece: docs/OVERVIEW.md, regras de negócio
- O que o código mostra: só existe rota de arquivar, não de apagar
- Hipótese usada no texto: comunidades não são apagadas, só arquivadas
- Resposta do dono:
```

## Nomenclatura

- Pastas em inglês e minúsculas (`docs`, `flows`, `database`, `assets`).
- Arquivos Markdown em inglês, em `MAIUSCULAS_COM_UNDERLINE.md`, exceto o `README.md`.
- Imagens em `minusculas-com-hifen.png`, com o nome do que mostram (`login-screen.png`, `community-flow.png`).
- O conteúdo é sempre em português. Termos técnicos ficam em inglês quando é assim que se fala (deploy, endpoint, token, health check).

## Banner e ícones

Todo arquivo Markdown de documentação começa com o banner. Os documentos de `docs/` e `flows/` também levam a linha de ícones quando ela ajuda. O banner e os ícones seguem o [padrão de README](./REPOSITORY_README.md) e o [padrão de assets](./ASSETS.md).

## Escrita

Toda documentação segue o [padrão de escrita](./WRITING.md).

## Antes de abrir a Pull Request

- [ ] Os obrigatórios existem, e cada opcional que se aplica também.
- [ ] Nenhum link quebrado. Links internos são relativos, e links para código do repositório de origem são absolutos para a `main` (`https://github.com/Solierrr/<repo>/blob/main/...`), conferidos.
- [ ] Toda imagem está em `assets/` e abre.
- [ ] Todo diagrama Mermaid renderiza no GitHub.
- [ ] Nenhum segredo, valor de variável, e-mail pessoal ou dado real.
- [ ] O texto passou pelo checklist do [padrão de escrita](./WRITING.md#revisão).
- [ ] Dúvidas no `PENDENCIAS.md`, com os trechos marcados.
