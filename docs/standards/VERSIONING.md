# Versão e release

O número do release do release-please é o mesmo em todo lugar: o que o serviço mostra, o contrato OpenAPI, a imagem Docker e o que roda em PROD. Todo release deixa um aviso na PR de release.

O fluxo do release-please (PR de release, `/release`, checkbox e auto-merge) está em [`github/workflow/README.md`](../../github/workflow/README.md#release-please-e-auto-merge).

## Quando sai um release

- A PR de release é mergeada **só quando algo vai para PROD**. O QA roda pelo SHA do commit, como hoje.
- O merge da PR de release dispara, pelo `docker-publish.yml` do repositório `.github`:
  - imagem com as tags `:X.Y.Z`, `:<sha>` e `:latest`;
  - release no GitHub, com a tag `vX.Y.Z` e o changelog;
  - `gitops-bump`, que abre a PR no `infra-gitops` trocando a tag da imagem para `X.Y.Z`.
- Bibliotecas não têm imagem: o merge publica o pacote ([publicação de pacotes](../../readme/deploy/PACKAGE_RELEASE.md)).

## Versão visível por stack

| Stack | Fonte da versão | Quem atualiza | Onde aparece |
|---|---|---|---|
| Spring (Maven) | `<version>` do `pom.xml` | release-please, por `extra-files` | `/actuator/info` (`build.version`) e `info.version` do OpenAPI |
| FastAPI e Python | `version.txt` na raiz (e `project.version` do `pyproject.toml`, se existir) | release-please (`version.txt` é nativo do `release-type: simple`) | `FastAPI(version=...)`, OpenAPI e `/health` |
| Node (Fastify, bibliotecas) | `version` do `package.json` | release-please (`release-type: node`) | OpenAPI e `/health` |
| Webs (`web-app`, `web-sandbox`) | `version` do `package.json` | release-please (`release-type: node`) | `version.json` público gerado no build |

A versão nunca é fixa no código (`v1`, `0.1.0`, `0.0.1-SNAPSHOT`). Ao adotar o padrão num repositório, a versão do arquivo é igualada à do `.release-please-manifest.json` uma vez, à mão; daí em diante o release-please mantém as duas iguais.

### Templates do release-please

Em [`github/workflow/common/`](../../github/workflow/common/), copiados para a raiz do repositório como `release-please-config.json`, junto com o `.release-please-manifest.json`:

| Stack | Template | O que atualiza |
|---|---|---|
| Spring (Maven) | `release-please-config.maven.json` | `pom.xml` (versão do projeto, não a do `parent`) |
| Python | `release-please-config.python.json` | `version.txt` e `pyproject.toml` |
| Node e webs | `release-please-config.node.json` | `package.json` e `package-lock.json` |
| Outros (infra, docs) | `release-please-config.json` | só changelog e tag |

- No Maven, o `xpath` usa `local-name()` porque o `pom.xml` declara o namespace padrão do Maven, e um `xpath` simples (`//project/version`) não encontra o nó.
- No Python sem `pyproject.toml`, remover a entrada `toml` do template.
- O `version.txt` precisa existir antes do primeiro release: o release-please atualiza, mas não cria.

### Spring

`pom.xml`:

```xml
<plugin>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-maven-plugin</artifactId>
  <executions>
    <execution>
      <goals>
        <goal>build-info</goal>
      </goals>
    </execution>
  </executions>
</plugin>
```

`application.properties`:

```properties
management.endpoints.web.exposure.include=health,info
management.info.build.enabled=true
```

O OpenAPI lê a mesma versão pelo `BuildProperties` ([exemplo](./OPENAPI.md#spring-springdoc)).

### Python

`app/version.py`:

```python
from pathlib import Path

VERSION = (Path(__file__).resolve().parents[1] / "version.txt").read_text(encoding="utf-8").strip()
```

O `Dockerfile` copia o `version.txt` para a imagem (o template de [`templates/docker/python/`](../../templates/docker/python/Dockerfile) já copia a raiz inteira).

### Webs

Um script de build grava `version.json` na pasta pública, servido em `/version.json`. Só o arquivo, sem rodapé na interface.

```json
{ "version": "1.4.0", "commit": "9260803", "builtAt": "2026-10-24T13:45:00Z" }
```

- `version` vem do `package.json`, `commit` do SHA do build (`GITHUB_SHA` no CI, `git rev-parse --short HEAD` local) e `builtAt` da hora do build em UTC.
- O arquivo gerado fica no `.gitignore`.

## Imagens e PROD

- Toda imagem de release tem a tag `:X.Y.Z`, sem o `v`.
- Os manifestos do `infra-gitops` apontam para `:X.Y.Z`, nunca para `:latest`. O `gitops-bump` troca a versão a cada release.
- `:latest` e `:<sha>` continuam publicados a cada push na `main`, para uso local e rastreio, nunca para PROD.

## Aviso na PR de release

Quando a PR de release é mergeada, o workflow comenta na própria PR, no mesmo estilo do comentário "Imagem Docker publicada" do `docker-publish`:

```markdown
## Release X.Y.Z publicado

- Versão: X.Y.Z
- Imagem: solarianetwork/<repo>:X.Y.Z (também :<sha> e :latest)
- Digest: <digest>
- Release: <link do release no GitHub>
- PR no infra-gitops: <link da PR de bump>
```

Repositório sem imagem omite as linhas de imagem, digest e `infra-gitops`.
