<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/pypi.png" alt="PyPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/openai.png" width="100" hspace="8" alt="OpenAI" title="OpenAI">
</p>

# Desenvolvimento

```bash
uv sync --frozen --extra dev   # ou: pip install -e ".[dev]"
ruff check . && ruff format --check .
pytest
```

Commits seguem `tipo: mensagem` (inglês, minúsculo). O versionamento é feito pelo `release-please`; o comando `/release` na PR de release publica no GitHub e o `publish.yml` envia ao PyPI por Trusted Publishing (ambiente `pypi`).
