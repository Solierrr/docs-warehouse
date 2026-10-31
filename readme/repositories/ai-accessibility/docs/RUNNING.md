<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# Execução local

Use Python 3.12, a versão do Dockerfile, `make` e Infisical CLI autenticado. O guia comum está em [PYTHON.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

Execute `make install`, `make vault` e `make dev`. A exportação usa somente `/llm`. O servidor inicia na porta 8080. A análise depende de credencial de visão e de chamador autorizado. O mapa de chamadores da configuração padrão está vazio nesta main. <!-- PENDENTE: 1 -->

| Comando | Efeito |
|---|---|
| `make test` | Pytest |
| `make lint` | Ruff e verificação de formato |
| `make build` | Compilação dos módulos |
| `make openapi` | Exportação do contrato |

`GET /ready` retorna 503 se nenhum provedor estiver configurado. Uma resposta UP não prova que a credencial remota funciona. O debug exige JWT administrativo e não equivale ao contrato da rota de produção.
