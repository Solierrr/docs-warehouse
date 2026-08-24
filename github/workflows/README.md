# github/workflows/

Modelos padronizados de `.github/workflows/` (CI, Code Quality e SonarQube),
um diretório por stack. São os workflows corrigidos usados hoje pelos
repositórios abaixo — copie os 3 arquivos da pasta correspondente para
`.github/workflows/` de um repositório novo (ou desatualizado) ao invés de
começar do zero.

| Stack | Pasta | Exemplo de repositório |
|---|---|---|
| Python | `python/` | ai-assistant, ai-validation, api-recommendation |
| Java + Maven | `java-maven/` | api-messenger, api-persistence |
| Kotlin + Maven | `kotlin-maven/` | api-auth |
| Kotlin + Gradle (Android) | `android-kotlin/` | mobile-app |
| Node + React | `node-react/` | web-app |

## Pegadinhas já resolvidas aqui

- **`sonarqube.yml`**: precisa de `github-token` e `run-id` no passo
  `actions/download-artifact@v4`. Sem isso, o job (disparado via
  `workflow_run`) procura o artefato `coverage` na própria run em vez da run
  do CI que o disparou, e sempre falha com
  `Artifact not found for name: coverage`.
- **`quality.yml` (Java/Kotlin)**:
  - Checkstyle (`java-maven/`): `google_checks.xml` marca praticamente tudo
    como severidade `warning` por padrão — use
    `-Dcheckstyle.violationSeverity=error` para falhar só em problema real,
    não em estilo/indentação.
  - ktlint (`kotlin-maven/`, `android-kotlin/`): todas as regras `standard:*`
    são de formatação. Para não travar o build em estilo, adicione ao
    `.editorconfig` do projeto:
    ```
    [*.{kt,kts}]
    ktlint_standard = disabled
    ktlint_standard_no-unused-imports = enabled
    ktlint_standard_no-wildcard-imports = enabled
    ```
- **`ci.yml` (Java/Kotlin)**: `mvnw`/`gradlew` precisam estar commitados com
  o bit de execução (modo `100755`). Confira com
  `git ls-files -s mvnw` / `git ls-files -s gradlew`; corrija com
  `git update-index --chmod=+x mvnw` se aparecer `100644`.

## Fora do escopo

Repositórios sem código de aplicação (só scaffold/infra, ex: Helm/Terraform)
não devem ter esses workflows — eles não têm o que testar/analisar.
