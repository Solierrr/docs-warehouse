<p align="center">
  <img src="../assets/readme/banners/neo4j.png" alt="Neo4j" width="100%">
</p>

# Situação

Levantamento da main `0d39bf86`, em 2026-10-30.

- Há extrator consistente somente leitura, snapshots, lock com lease, contagem por estágio, validação de retenção e recuperação de limpeza (2026-10-30).
- O SQL usa schema antigo, incluindo `users` e referências `fk_*`, sem adaptação à normalização atual do cadastro central. Compatibilidade do ambiente de origem não foi comprovada (2026-10-30). <!-- PENDENTE: 1 -->
- A retenção mínima padrão de 0.5 protege volume relativo, sem verificar qualidade ou mínimo absoluto na primeira carga. Confirmar política de quedas legítimas e carga vazia (2026-10-30). <!-- PENDENTE: 2 -->
- Consumidores precisam filtrar a versão ativa. A revisão não executou Job, verificou secrets ou confirmou o leitor implantado (2026-10-30). <!-- PENDENTE: 3 -->
- O extrator guarda todos os datasets em memória. Lote de escrita não limita essa alocação (2026-10-30).
- Renovação do lock acontece entre consultas e lotes. Consulta longa pode ultrapassar a lease e permitir disputa por outra execução (2026-10-30).
- Falha de limpeza após ativação não desfaz a versão ativa e pode deixar versões pendentes (2026-10-30).
- A árvore atual não contém os testes descritos nos READMEs antigos. O CI faz smoke do container e configuração, sem validar integração de dados (2026-10-30).
