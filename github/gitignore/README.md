# github/gitignore/

Fragmentos de `.gitignore` acopláveis. `base.gitignore` cobre o que todo
repositório precisa independente da stack (IDEs, SO, `.env`/segredos
locais) — todo `.gitignore` novo deve incluir esse conteúdo. Some com um ou
mais fragmentos de stack por cima, conforme o que o repositório usa.

| Arquivo | Cobre |
|---|---|
| `base.gitignore` | IDEs/editores, arquivos de SO, `.env` — sempre incluído |
| `java.gitignore` | Maven/Gradle, `.class`/`.jar`, Kotlin build cache |
| `python.gitignore` | venvs, cache de bytecode, pytest/coverage/mypy/ruff |
| `node.gitignore` | `node_modules/`, builds, cache de bundlers, coverage |
| `android.gitignore` | Gradle/Android Studio, keystores, `google-services.json` |
| `terraform.gitignore` | `.terraform/`, `.tfstate`, `.tfvars` |
| `sql.gitignore` | dumps/backups locais, credenciais de conexão |

Exemplo: um repositório Python + Java acopla `base.gitignore` + `java.gitignore` + `python.gitignore`.

Nenhum fragmento de stack repete o que já está em `base.gitignore` (IDE,
SO, `.env`) — evita divergência entre fragmentos quando um for atualizado e
o outro não.
