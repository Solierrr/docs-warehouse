<p align="center">
  <img src="../assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Instalação e execução no workspace

O repositório versiona os notebooks, o job, a segurança e os painéis, mas esses arquivos não comprovam que foram importados, provisionados ou executados no Databricks, e não há Dockerfile nem deploy de servidor próprio.

## Preparação do job

O job contém uma task de transformação e outra de exportação dependente da primeira, com uma execução concorrente. Os caminhos de workspace presentes no JSON são específicos de um ambiente e precisam ser substituídos por caminhos autorizados, sem reproduzir identificação pessoal na documentação. <!-- PENDENTE: 2 -->

O notebook exige parâmetros de catálogo, modo manual e caminhos das duas planilhas no volume. O leitor declara necessidade de runtime com suporte a Excel. Confirmar runtime e compute antes de instalar. O notebook só cria os schemas Silver e Gold, portanto catálogo, volume e origem Bronze precisam estar disponíveis.

As tabelas antigas controladas por pipelines exigem cutover. Remover os arquivos antigos do Git não remove objetos no workspace. A proteção de substituição permite Delta gerenciada e recusa views ou formatos diferentes, salvo override explícito. <!-- PENDENTE: 2 -->

## Segurança e exportação

Provisionar a função de filtro e o mapa de principais no catálogo correto. O SQL de segurança começa em `workspace`, com comentário para ajuste ao catálogo do job. Confirmar acessos de job, exportador e usuários finais antes da publicação. <!-- PENDENTE: 4 -->

O notebook de exportação lê `endpoint-url` e `api-token` de um secret scope. Envia `POST /sync/gold` com Bearer e timeout de 1800 segundos e exige resposta com status completed. Ele não traduz nomes nem schemas.

O produtor atual publica `gold` com nomes em inglês, enquanto o exportador exige `gold_core` e manifesto com nomes em português. A integração exige migração ou camada de compatibilidade, não só configurar o endpoint. <!-- PENDENTE: 1 -->

## Painéis

Há duas definições `.lvdash.json`, a de administração com 19 datasets e a de fornecedor com dez, e as fontes declaradas apontam para `workspace.gold`, enquanto o job declara `analytics`, por isso o catálogo e a publicação efetiva precisam ser confirmados depois do job. O README de origem ainda diz que não há painéis, apesar desses arquivos. <!-- PENDENTE: 2 -->

Não foram instalados jobs, enviados arquivos ou executadas chamadas nesta revisão. O processo comum está em [cópia dos dados para análise](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/ANALYTICS_SYNC.md).

Fontes em [job](https://github.com/Solierrr/databricks-stocker/blob/main/exports/medallion_export_job.json), [exportação](https://github.com/Solierrr/databricks-stocker/blob/main/exports/trigger_gold_sync.py), [segurança](https://github.com/Solierrr/databricks-stocker/blob/main/security/supplier_access.sql) e [painéis](https://github.com/Solierrr/databricks-stocker/tree/main/dashboards).
