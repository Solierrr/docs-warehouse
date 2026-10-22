<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Próximas etapas

## Dashboards: próxima etapa

Nenhum dashboard da nova arquitetura foi implementado nesta branch. As 11 views Gold estão disponíveis como fonte inicial; outro integrante do time ainda criará os painéis no Databricks para administração da plataforma, empresa fornecedora, empresa demandante, profissional contratado e profissional autônomo. O desenho dos painéis, os filtros e a correspondência dos vínculos profissionais com essas personas ainda precisam ser definidos.

A pasta `dashboards/` está reservada para os arquivos exportados desses painéis. Os dashboards de `archive/legacy_dashboards/` pertencem à arquitetura anterior e não devem ser tratados como entrega atual. Antes da publicação, o acesso aos dados de cada empresa precisará ser restringido na camada consumida; filtros visuais não substituem essa autorização.

## Outras etapas futuras

O notebook `exports/export_gold_to_analyticsdb.ipynb` é apenas um espaço reservado. A exportação da Gold para o AnalyticsDB e o consumo pela API/front ainda não foram implementados. Os notebooks de `archive/legacy_notebooks/` também são referências anteriores e não participam das pipelines atuais.

`entrypoint.sh`, `Dockerfile` e `.env.example` são auxiliares existentes, sem implantação do fluxo analítico por este repositório.
