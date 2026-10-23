<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
</p>

# Arquitetura do Repositório

O `database-rpa` é uma rotina de ETL em Python que migra usuários e dados de um banco legado para o `coredb`. Ela lê a origem com conexão somente leitura, transforma os registros para as regras do schema V29 e grava diretamente no destino. O que a origem não possui é preenchido com dados fictícios determinísticos, e a execução pode ser repetida sem duplicar registros.

- **Extração, transformação e carga:** `extract.py`, `transform.py` e `load.py` tratam os usuários e os dados de contato; `extended_migration.py` cobre empresas, endereços, ofertas, estoque e as demais tabelas.
- **Regras do destino (`schema_v29.py`):** concentram as restrições do schema V29 que a migração respeita, como formatos e unicidade.
- **Dados fictícios (`mock_data.py`):** preenchem o que o legado não traz, de forma determinística.
- **Imagens (`images.py`):** quando configurado, associa fotos do `mocks-warehouse` aos registros migrados.
- **Orquestração (`main.py`):** executa as etapas e registra o andamento em log.
- **Limite conhecido:** a rotina não escreve no `authdb`; os usuários migrados só conseguem entrar depois que uma conta com o mesmo identificador for criada.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── tests/
├── config.py
├── db.py
├── extended_migration.py
├── extract.py
├── images.py
├── inspecionar.py
├── load.py
├── main.py
├── mock_data.py
├── schema_v29.py
├── transform.py
├── Makefile
├── requirements.txt
└── README.md
```
