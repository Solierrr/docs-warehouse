<p align="center">
  <img src="../assets/readme/banners/render.png" alt="Render" width="100%">
</p>

# Executando localmente

A execução local usa Bash e `curl`, e o `Makefile` também requer `make` e `sh`, por isso no Windows o recomendado é o Git Bash. O código não fixa as versões dessas ferramentas.

## Preparação

1. Instale o Infisical CLI e autentique-se com `infisical login` para obter a configuração.
2. Execute `make doctor` para verificar as ferramentas. O diagnóstico inclui Git, Bash e ShellCheck.
3. Execute `make vault` para criar o `.env` a partir de `/service-urls` no ambiente `local`. Para outro ambiente autorizado, passe `ENV=qa` ou `ENV=prod` ao comando. O comando não substitui o arquivo se a extração falhar.

O procedimento geral de variáveis está em [Infisical](https://github.com/Solierrr/docs-warehouse/blob/main/readme/infisical/README.md). Não há guia de execução comum específico para Bash em `readme/running/`.

## Comandos

| Comando | Resultado |
|---|---|
| `make dev` | Carrega e exporta o `.env` e executa um ciclo. |
| `make build` | Confere a sintaxe dos scripts Bash com `bash -n`. |
| `make lint` | Executa ShellCheck nos scripts da raiz. |
| `make test` | Informa que não há comando de teste configurado. |
| `make ci` | Executa lint, test e build nessa ordem. |

Confira o resumo e o código de saída após `make dev`. A execução falha quando nenhuma variável termina em `_URL` ou quando pelo menos um destino esgota as tentativas. Uma URL inválida, inacessível ou com resposta HTTP de erro pode produzir falha. O script registra as URLs completas, portanto use somente endereços sem dados sensíveis.
