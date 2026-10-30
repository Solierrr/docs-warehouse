<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Execução local

## Pré-requisitos

Use Python 3.14 ou superior, `make` e um shell compatível. O Infisical CLI autenticado fornece o ambiente. As dependências estão em [`pyproject.toml`](https://github.com/Solierrr/api-google/blob/main/pyproject.toml). Consulte também o [guia comum de Python](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

## Preparação e comandos

Na raiz do repositório de origem, `make vault` obtém as variáveis da pasta `/google`. O [exemplo de ambiente](https://github.com/Solierrr/api-google/blob/main/.env.example) lista os nomes necessários. A validação de JWT requer o JWKS do serviço de autenticação. As chaves dos chamadores internos precisam ter ao menos 32 caracteres.

```bash
make install
make vault
make dev
make test
make lint
make openapi
```

`make dev` inicia o Uvicorn na porta 8000. `make test` executa pytest, `make lint` verifica Ruff e `make openapi` exporta o contrato sem depender de um arquivo de ambiente. O [Makefile](https://github.com/Solierrr/api-google/blob/main/Makefile) também oferece `make build`, `make doctor` e `make ci`.

## Verificação e falhas comuns

Abra `http://localhost:8000/docs` para testar a API. `/health` confirma o processo e `/ready` confirma a criação dos clientes. As operações de endereço e fuso exigem JWT. Tradução e energia solar exigem a chave do chamador. Sem chave do provedor, a consulta externa falha. Sem JWKS, as rotas de usuário retornam indisponibilidade da autenticação. Uma chave de serviço curta impede a inicialização.
