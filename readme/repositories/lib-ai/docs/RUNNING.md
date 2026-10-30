<p align="center">
  <img src="../assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

# Execução local

Requer Python 3.14 ou superior, uv, Git, make e shell compatível. No Windows, os alvos do Makefile usam Git Bash. O procedimento comum está em [execução Python](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/PYTHON.md).

## Preparar e verificar

Executar no checkout da biblioteca.

```bash
make doctor
make install
make lint
make test
make build
```

A instalação usa `uv sync --frozen --extra dev`, com suporte A2A. Os demais alvos executam Ruff, pytest e `uv build`. `make dev` não inicia servidor. Não há alvo `make openapi`.

Os testes ficam em `tests/`, separados por módulo. O CI usa Python 3.14, uv 0.12.22, dependências congeladas, cobertura e build da distribuição.

## Configuração

`make vault` lê `/service-urls` por padrão e não carrega automaticamente as chaves dos provedores no processo. O consumidor deve disponibilizar as credenciais no ambiente. Confirmar o procedimento local de obtenção delas. <!-- PENDENTE: 1 -->

| Nome | Uso |
|---|---|
| `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY` | Chave por provedor |
| `<PROVEDOR>_API_KEY_2` até `_9`, também sem sublinhado antes do número | Chaves adicionais |
| `<PROVEDOR>_API_KEYS` | Lista adicional separada por vírgula |
| `LLM_PROVIDER_ORDER` | Ordem para a interface que lê o ambiente |
| `LLM_MODEL_<PROVEDOR>` | Modelo, com precedência abaixo do argumento `model` |
| `LLM_TEMPERATURE_OPENAI` | Temperatura enviada pelo adaptador correspondente quando definida |

Valores repetidos são eliminados e marcadores de preenchimento são ignorados. O adaptador sem modelo padrão exige configuração explícita. Não registrar credenciais em logs.

## Diagnóstico

`RegistryKeysNotConfigured` indica ausência de chave. `RegistryKeysUnavailable` indica chaves excluídas, inválidas ou em cooldown. A seleção não espera o cooldown. A aplicação só tenta outro provedor se construiu uma cadeia de fallback.

As fontes são [Makefile](https://github.com/Solierrr/lib-ai/blob/main/Makefile) e [CI](https://github.com/Solierrr/lib-ai/blob/main/.github/workflows/ci.yml).
