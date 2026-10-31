<p align="center">
  <img src="../assets/readme/banners/render.png" alt="Render" width="100%">
</p>

# Execução agendada

A rotina roda como workflow do GitHub Actions. Ela não é um serviço publicado no Render. O Render hospeda serviços que podem ser consultados pela rotina, conforme o [processo de QA](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md).

## Ambientes

| Ambiente | Onde roda | Configuração dos destinos |
|---|---|---|
| Local | Máquina de desenvolvimento | `.env` gerado por `make vault`, ambiente `local` por padrão |
| QA | Runner `ubuntu-latest` do GitHub Actions | `/service-urls` do Infisical no ambiente `qa` |
| Produção | Não há execução de produção configurada no workflow | Não se aplica |

## Agendamento e acesso

O [workflow](https://github.com/Solierrr/infra-keepalive/blob/main/.github/workflows/keepalive.yml) declara execução a cada dez minutos e aceita disparo manual por `workflow_dispatch`. O GitHub pode atrasar execuções agendadas. O job usa `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` como segredos do GitHub e `INFISICAL_PROJECT_SLUG` como variável do repositório. A action autentica no Infisical por Universal Auth e exporta `/service-urls` para o ambiente do job.

Os endereços específicos e seus caminhos são definidos fora do repositório. Não há URL pública para a própria rotina. A alteração do workflow segue o fluxo de revisão e merge do repositório. O [fluxo geral de release e deploy](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md) descreve a publicação dos serviços da plataforma, não uma implantação desta rotina no GKE.
