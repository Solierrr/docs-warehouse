# github/community/

Templates de arquivos de comunidade/governança do GitHub. Copie para cada
repositório novo em vez de escrever do zero.

- `CODEOWNERS` vai para `.github/CODEOWNERS`. Define quem é dono de qual
  caminho; troque `{{FULL_NAME}}`/`{{github_user}}` pelos reais. Só tem
  efeito de bloqueio se o ruleset da branch exigir revisão de code owner.
- `CONTRIBUTING.md` vai para `.github/CONTRIBUTING.md`. Guia de
  contribuição (padrão de commit, branch e PR), alinhado às convenções do
  Confluence e ao `orientacoes.md`.

`SECURITY.md` e `CODE_OF_CONDUCT.md` não são copiados para cada
repositório, eles vivem só na raiz do repositório especial
[`Solierrr/.github`](https://github.com/Solierrr/.github). O GitHub aplica
esses dois automaticamente a qualquer repositório da organização que não
tenha sua própria cópia (community health files). Ficam aqui só como
template/histórico de referência.

## Pegadinhas já resolvidas aqui

- CODEOWNERS não aceita `@usuario (Nome Real)` na mesma linha. O parser
  trata cada item separado por espaço como um dono, e `(Nome` quebra a
  sintaxe. Coloque o nome como comentário na linha de cima.
- A **última** regra do CODEOWNERS que casar com o arquivo é a que vale,
  não a primeira. Regras genéricas (`*`) vêm no topo, específicas depois.
