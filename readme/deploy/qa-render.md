<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/render.png" alt="Render" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/docker.png" width="100" hspace="8" alt="Docker" title="Docker">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/github-actions.png" width="100" hspace="8" alt="GitHub Actions" title="GitHub Actions">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/infisical.png" width="100" hspace="8" alt="Infisical" title="Infisical">
</p>

# Deploy de QA no Render

README reutilizável. O ambiente de QA roda no [Render](https://render.com) e é atualizado sozinho a cada commit na branch `qa`. Não há passo manual: quem sobe o commit já está fazendo o deploy. Serve para validar uma versão antes que ela siga para a produção.

## Como funciona

1. A mudança entra em `main` por Pull Request, depois do CI.
2. O workflow `qa-sync` abre uma Pull Request de `main` para `qa`. O merge dela é o que faz o Render testar **exatamente o commit promovido**. O sentido é sempre `main` para `qa`; levar algo de `qa` para `main` é exceção e passa por Pull Request revisada.
3. O Render detecta o commit novo na `qa`, constrói e publica o serviço.
4. O ambiente `QA` aparece no repositório no GitHub, verificado por workflow.

Para um repositório novo, o serviço no Render aponta para a branch `qa`, com deploy automático ligado.

## Tipos de serviço no Render

| Runtime | Como constrói | Uso |
|---|---|---|
| `docker` | Usa o `Dockerfile` do repositório | Maior parte dos serviços (`api-auth`, `api-core`, `api-messenger`, `api-recommendation`, `ai-validation`, `api-email`) |
| `python` nativo | O build instala as dependências e, quando preciso, o Infisical CLI; o start é o `render-entrypoint.sh` | `ai-assistant`, `ai-geographic`, `ai-operational` |
| Site estático | `npm run build` e publicação da pasta gerada | `web-app` |

## Serviços independentes

`infra-gateway`, `databricks-sync` e `web-sandbox` existem só no Render e publicam a partir da `main`. Não têm branch `qa`, não passam pelo ArgoCD nem pelo GKE, e o ambiente que mostram no GitHub é `ALIVE`.

## Segredos

O Render recebe a configuração por variáveis do serviço ou do grupo, alimentadas pelo [Infisical](../infisical/README.md). Quando o sync nativo não cobre as pastas, o serviço usa o `entrypoint.sh` com Universal Auth **só em runtime**, nunca no build. Se não houver credenciais Infisical, o serviço sobe com as variáveis que o Render já injetou.

## Plano gratuito

O plano gratuito hiberna o serviço depois de um tempo parado, e acordar pode levar cerca de um minuto. O repositório `infra-keepalive` faz um ping periódico nos serviços de QA para reduzir isso.

## Quando algo falha

- **Deploy falhou na construção:** abra o log do deploy no painel do Render. Falhas de `Dockerfile` aparecem antes de qualquer log da aplicação.
- **Serviço sobe e cai:** quase sempre falta uma variável obrigatória. O serviço informa o nome da variável na mensagem de erro de configuração.
- **Voltar a versão:** reverta o commit na `main`; o `qa-sync` leva a correção para a `qa`.
