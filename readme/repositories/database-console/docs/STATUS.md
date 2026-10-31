<p align="center">
  <img src="../assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- Não há mais DDL de negócio e identidade aqui. As APIs são donas de seus schemas.
- O schema de analytics cria controle de autorização. As tabelas de indicadores são criadas pelo exportador conforme as views publicadas.
- `ro_bootstrap` lê objetos selecionados de `export`. `ro_databricks` lê as views de `export` nos dois bancos. `rpa_writer` escreve apenas nos objetos contratados e somente em QA.
- `ro_mcp` e `ro_recommendation` foram removidos do contrato, embora fontes de outros repositórios ainda possam apresentar acesso SQL. A compatibilidade precisa de confirmação. <!-- PENDENTE: 2 -->
- A classificação do diretório de backup procura `Environment=` no cabeçalho, enquanto `make vault` escreve `env=`. O diretório pode ser classificado como `unknown`.
- A política e os exercícios de restauração não estão automatizados. <!-- PENDENTE: 1 -->
