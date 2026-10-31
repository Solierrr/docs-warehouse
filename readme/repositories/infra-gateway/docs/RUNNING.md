<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="kong" width="100%">
</p>

# Execução local

Use Docker para o gateway QA e Helm para renderizar os valores de cluster. O guia comum está em [HELM.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/HELM.md).

Execute `make install` para registrar o repositório de charts e `make build` para renderizar dev e prod. `make test`, `make lint`, `make dev` e `make vault` não têm configuração específica.

```sh
docker build -t gateway-local .
docker run --rm -p 8000:8000 gateway-local
```

Consulte `http://localhost:8000/health` e depois um caminho de destino, como `/api-auth/.well-known/jwks.json`. O CI também executa `kong config parse` no arquivo de QA. Validar o YAML não comprova que a origem remota está disponível.
