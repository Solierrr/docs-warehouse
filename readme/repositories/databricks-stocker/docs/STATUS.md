<p align="center">
  <img src="../assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Situação

Levantamento da main `4b1ce020`, em 2026-10-31.

- O fluxo atual lê duas planilhas e escreve 25 tabelas Bronze, 24 Silver e 19 Gold. As antigas pastas de pipelines SQL não fazem parte desta árvore (2026-10-31).
- A exportação usa endpoint existente no serviço de sincronização, mas catálogo, schema e nomes de indicadores divergem do contrato atual desse destino. O alinhamento não está implementado aqui (2026-10-31). <!-- PENDENTE: 1 -->
- O repositório contém duas definições de painéis, apesar do texto de origem dizer que ainda não existem. Publicação, compute e cutover de objetos antigos não foram confirmados (2026-10-31). <!-- PENDENTE: 2 -->
- Qualidade exclui registros inválidos e todos os registros com id duplicado. Contagens são impressas, sem tabela persistente de rejeições. A relação entre tipos de vínculo profissional e personas permanece indefinida no texto de origem (2026-10-31). <!-- PENDENTE: 3 -->
- Dez tabelas de fornecedor recebem filtro por principal. As outras nove tabelas Gold não recebem esse filtro no escritor. Acesso final depende de grants e provisionamento por persona (2026-10-31). <!-- PENDENTE: 4 -->
- Execução local reutiliza transformações, sem aplicar row filter, escrever Delta ou acionar exportação. Seu JSON reúne os fornecedores presentes nas entradas (2026-10-31).
- Substituições são por tabela, sem uma transação global das três camadas. Falha pode deixar parte do conjunto atualizada (2026-10-31).
- Contagens atuais não são séries históricas. Aceite por mês usa data de criação como aproximação e não data efetiva de aceite (2026-10-31).
- Não há tabelas de pedidos, itens de pedido ou pagamentos na Silver atual. Os indicadores não devem ser descritos como receita realizada de pedidos (2026-10-31).
