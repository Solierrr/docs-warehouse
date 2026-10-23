<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/claude.png" alt="Claude" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
</p>

# Desenvolvimento

## Rodando localmente

1. Copie `.env.example` para `.env` e preencha `DATABASE_URL` e `MCP_API_KEY`.
2. Instale dependências com `pip install -r requirements.txt`.
3. Inicie com `python server.py`.

Para usar o padrão organizacional de ambiente, prefira `make env ENV=local`
antes do start.

## Docker

```sh
docker build -t api-mcp .
docker run --env-file .env -p 8001:8001 api-mcp
```

## Testes

```sh
python -m pytest tests -v
```

Os testes usam mocks e não requerem PostgreSQL nem um `.env` real.
