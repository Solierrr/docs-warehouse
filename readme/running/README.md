<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/template.png" alt="Template" width="100%">
</p>

# Como rodar o projeto

README reutilizável. O jeito de rodar um projeto localmente é o mesmo para todo repositório da mesma stack, então há um documento por stack: copie o que combina com o repositório para a raiz (ou `docs/`) como `RUNNING.md` e ajuste só o que for específico dele.

| Stack | Documento | Repositórios de exemplo |
|---|---|---|
| Java com Maven (Spring Boot) | [JAVA.md](./JAVA.md) | `api-core`, `api-messenger` |
| Kotlin com Maven (Spring Boot) | [KOTLIN_SPRINGBOOT.md](./KOTLIN_SPRINGBOOT.md) | `api-auth` |
| Kotlin com Gradle (Jetpack Compose e Android) | [KOTLIN_JETPACK_COMPOSE.md](./KOTLIN_JETPACK_COMPOSE.md) | `mobile-app` |
| Python (FastAPI) | [PYTHON.md](./PYTHON.md) | `ai-assistant`, `ai-validation`, `api-recommendation` |
| TypeScript (Vite) | [TYPESCRIPT.md](./TYPESCRIPT.md) | `web-app`, `web-sandbox` |
| Terraform | [TERRAFORM.md](./TERRAFORM.md) | `infra-platform` |
| Helm chart | [HELM.md](./HELM.md) | `infra-gateway` |
| Manifestos do ArgoCD | [ARGOCD.md](./ARGOCD.md) | `infra-gitops` |
| Manifestos do Kustomize | [KUSTOMIZE.md](./KUSTOMIZE.md) | `infra-otel-collector` |

Os quatro últimos não são aplicações: não há servidor de desenvolvimento, só validação e renderização do manifesto antes do merge.

## O que todos têm em comum

- **Makefile padrão.** Todo repositório de código parte do contrato em [`templates/make/`](../../templates/make/README.md): `make doctor`, `make vault`, `make install`, `make dev`, `make lint`, `make test`, `make build` e `make ci`.
- **Segredos.** Vêm do Infisical com a sua conta (`make vault`); ver [segredos e variáveis](../infisical/README.md).
- **Chamadas manuais.** Em API HTTP, a coleção da pasta `http/` é aberta no Bruno; ver [coleção Bruno](../bruno/README.md).
- **Container.** Subir pela imagem é opcional e usa o `Dockerfile` do repositório, o mesmo artefato do deploy; ver [deploy](../deploy/README.md).
- **Guia curto.** [Como rodar um serviço localmente](../../helps/TRY-LOCAL.md) mostra o passo a passo do `Makefile`.
