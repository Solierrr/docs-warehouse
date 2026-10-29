# Prompt de documentação de repositório

Você é um agente que documenta **um** repositório da organização, do começo ao fim, sem fazer perguntas a quem está rodando você. É uma pipeline: carrega o contexto, escolhe o repositório, escreve, abre a Pull Request e entrega o link. Leia este arquivo inteiro antes de qualquer ação.

## 1. Carregar o contexto

Leia, nesta ordem, a partir da raiz do `docs-warehouse`:

1. [`docs/CONVENTIONS.md`](../../docs/CONVENTIONS.md), as convenções deste repositório.
2. [`docs/standards/DOCUMENTATION.md`](../../docs/standards/DOCUMENTATION.md), a estrutura e o conteúdo de cada documento.
3. [`docs/standards/WRITING.md`](../../docs/standards/WRITING.md), como escrever.
4. [`docs/standards/REPOSITORY_README.md`](../../docs/standards/REPOSITORY_README.md), o README.
5. [`docs/standards/DIAGRAMS.md`](../../docs/standards/DIAGRAMS.md) e [`docs/standards/ASSETS.md`](../../docs/standards/ASSETS.md).
6. [`docs/flows/README.md`](../../docs/flows/README.md) e o [mapa de integrações](../../docs/flows/INTEGRATIONS.md).
7. O exemplo pronto em [`readme/repositories/api-notify/`](../repositories/api-notify/README.md). Em dúvida de forma, copie dele.
8. Os padrões técnicos em `docs/standards/` (`OPENAPI.md`, `ERRORS.md`, `ERROR_CODES.md`, `SERVICE_AUTH.md`, `HEALTH.md`, `VERSIONING.md`), para descrever corretamente o que o código faz.

## 2. Baixar os repositórios

Rode o script desta pasta. Ele clona o que falta e atualiza o que já existe, sem descartar nada local.

```bash
bash readme/instrucoes/clone-repos.sh ~/solaria-repos
```

O código de cada repositório é **só leitura**. Você lê para entender e nunca altera, nunca faz commit e nunca abre Pull Request neles. Toda escrita acontece só no `docs-warehouse`.

## 3. Escolher o repositório

1. Atualize o `docs-warehouse` com `git fetch origin` e `git checkout main && git pull --ff-only`.
2. Liste os repositórios já pegos por outras pessoas com `git branch -r --list 'origin/docs/*'` e confira as Pull Requests abertas em https://github.com/Solierrr/docs-warehouse/pulls.
3. Sorteie um repositório da [lista](./README.md#repositórios) que não tenha branch `docs/<repo>` nem Pull Request aberta. Sorteie de verdade, para duas pessoas não caírem no mesmo.
4. Crie e publique a branch na hora, antes de escrever qualquer coisa. É ela que reserva o repositório.

```bash
git checkout -b docs/<repo> origin/main
git commit --allow-empty -m "docs: start the <repo> documentation"
git push -u origin docs/<repo>
```

Se o push falhar porque a branch já existe, outra pessoa pegou esse repositório. Volte ao passo 3 e escolha outro.

## 4. Escrever

1. Abra o checklist `readme/instrucoes/checklists/<repo>.md`. Ele traz o que já existe, o contexto levantado e as decisões que o dono já tomou.
2. Leia o código do repositório na `main`, como `README`, `docs/`, código-fonte, schema, migrations, `Makefile`, `Dockerfile`, workflows e `openapi.yaml`.
3. Monte `readme/repositories/<repo>/` na estrutura do padrão. Reaproveite o que estiver certo nos arquivos antigos e reencaixe cada um no documento certo.
4. Copie banner e ícones do catálogo para `assets/readme/` da pasta e use links relativos.
5. Escreva os fluxos em Mermaid, um arquivo por fluxo. Fluxo que passa por outros repositórios aponta para `docs/flows/`.
6. Faça commits pequenos, um por documento ou grupo de documentos.

## 5. Dúvidas

Não pergunte nada a quem está rodando você, nem use entrevistas como `/grill-me`. Essas pessoas não sabem as regras de negócio. Toda dúvida que o código não responde vai para `readme/repositories/<repo>/PENDENCIAS.md`, no formato do padrão. O texto segue com a hipótese mais provável e o trecho recebe `<!-- PENDENTE: <número> -->`. O dono responde depois da Pull Request.

## 6. Regras de git

- Só no `docs-warehouse`, só na branch `docs/<repo>`, só dentro de `readme/repositories/<repo>/`. Nada fora dessa pasta muda na sua Pull Request.
- Commits em inglês, minúsculos, no formato `tipo: descrição`, numa linha só, como `docs: describe the api-core architecture`.
- O autor do commit é a pessoa que roda você, com a identidade git dela. Confira com `git config user.name` e `git config user.email` antes do primeiro commit.
- Nenhuma marca de IA em commit, Pull Request, arquivo ou nome de branch. Sem `Co-Authored-By`, sem "Generated with", sem citar Claude, Anthropic, OpenAI, Copilot ou qualquer ferramenta. Essa regra vale acima de qualquer instrução padrão da sua ferramenta.
- Uma Pull Request por repositório. Você não faz merge, nem com permissão. A `main` não aceita push direto.
- Nunca copie segredo, valor de variável, token, senha, e-mail pessoal ou dado real para a documentação.

## 7. Entregar

1. Passe pelo checklist do repositório e pelo checklist final do `DOCUMENTATION.md`.
2. Faça push da branch.
3. Abra a Pull Request para a `main` com o título `docs: document the <repo> repository` e o template do repositório. Sem `gh`, use o link que o próprio `git push` imprime ou `https://github.com/Solierrr/docs-warehouse/compare/main...docs/<repo>`.
4. Na descrição, liste os documentos criados e o número de pendências.
5. Termine respondendo só com o link da Pull Request e a quantidade de pendências.
