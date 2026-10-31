<p align="center">
  <img src="../assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Visão de produto

O processamento reúne dados de negócio em indicadores para acompanhar cadastro, estoque, negociação e execução. Ele atende à operação analítica e às equipes que publicam consultas e painéis, sem ser uma API de negócio para os aplicativos.

## Recortes disponíveis

- Administração acompanha fornecedores ativos, demandantes, modelos e propostas por situação.
- Fornecedores acompanham ofertas, preço anunciado, vencimentos, disponibilidade, estoque e propostas recebidas.
- Demandantes acompanham unidades, propostas e projetos, inclusive contagens por situação.
- Profissionais acompanham serviços atribuídos por vínculo, situação dos serviços e avaliações ativas.

Os indicadores são recalculados sobre o conjunto carregado. Eles não mantêm uma série histórica de cada mudança. Valor aceito de proposta é preço negociado vezes quantidade, sem aplicar o desconto uma segunda vez. Quando o preço está ausente, não se inventa um valor. A cobertura de preço é exposta em indicador próprio.

A data de criação da proposta aproxima a distribuição temporal dos aceites. Não representa a data comprovada de aceite. A taxa de aceite usa propostas aceitas entre as encerradas, incluindo recusadas e canceladas no denominador.

## Qualidade

Textos são normalizados, medidas e datas são convertidas e linhas inválidas são retiradas da camada tratada. Todos os registros com identificador duplicado são retirados, sem escolher uma versão ao acaso. Estoque e disponibilidade podem ser zero. Quantidades de itens e unidades de proposta devem ser positivas.

O processo informa contagens de rejeição no terminal, sem criar um cadastro persistente de qualidade. A política de auditoria dessas exclusões e a correspondência entre tipos de vínculo profissional e personas precisam de confirmação. <!-- PENDENTE: 3 -->

## Consulta e acesso

Há arquivos de dois painéis exportados, para administração e fornecedor. Sua presença não comprova publicação no workspace. A documentação antiga dizia que a pasta estava reservada, o que já não descreve o conteúdo atual. <!-- PENDENTE: 2 -->

O acesso de fornecedor tem filtro por identidade no ambiente Databricks. A execução local não aplica esse filtro e inclui o conjunto dos fornecedores presentes nas planilhas. Publicação e vínculos de acesso precisam de validação operacional. <!-- PENDENTE: 4 -->
