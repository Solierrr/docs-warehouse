# templates/python/

Base de dependências dos serviços Python da org. Todos rodam na mesma versão de Python (3.14) e com as versões cravadas, para o redeploy de um serviço não mudar o comportamento de outro.

| Arquivo | Onde vai no repositório |
|---|---|
| `requirements.txt` | `requirements.txt` (manter só o que o serviço usa) |
| `../docker/python/Dockerfile` | `Dockerfile` (`python:3.14-slim`) |

## Regras

- Python 3.14 em Dockerfile, CI (`python-version: "3.14"`) e `requires-python` das libs.
- Versões sempre cravadas com `==`. Atualização por Dependabot (semanal, só minor e patch, uma PR agrupada); major é decisão manual.
- Serviços de IA que consomem o corretor de chaves do `google-registry` adicionam `solaria-lib` (pacote do repositório `ai-lib`), também cravado, e não mantêm chaves de LLM próprias.
- As versões desta lista foram resolvidas juntas em Python 3.14; ao subir uma, rode a suíte do serviço antes de propagar.
