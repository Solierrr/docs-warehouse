<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Arquitetura do Repositório

O `ai-accessibility` é uma API FastAPI que recebe uma imagem, valida o arquivo, consulta um provedor de inteligência artificial para obter sinais de moderação e aplica uma política determinística sobre esses sinais. Quando a imagem é aprovada, o serviço gera uma descrição curta para leitores de tela. A decisão final não depende só do modelo: a política fixa transforma os sinais em um dos três resultados possíveis (aprovada, revisão humana ou recusada).

- **Validação de entrada (`image/`):** aceita JPEG, PNG e WebP e recusa arquivos fora do formato ou do tamanho permitido antes de chamar qualquer modelo.
- **Moderação (`moderation/`):** combina os sinais do provedor com regras determinísticas para chegar ao resultado.
- **Descrição acessível (`caption/`):** gera o texto alternativo apenas para imagens aprovadas.
- **Provedores (`providers/`):** isolam a chamada aos modelos (Gemini e Groq), o que permite trocar de provedor sem mudar o fluxo.
- **Orquestração (`services/`) e API (`api/`):** o serviço de análise encadeia as etapas, e a API expõe a rota interna de análise e o health check.
- **Sem estado:** nenhuma imagem nem resultado é armazenado.

## Estrutura do repositório

```text
├── .github/
├── docs/
├── src/
│   ├── api/
│   ├── caption/
│   ├── core/
│   ├── image/
│   ├── moderation/
│   ├── providers/
│   └── services/
├── tests/
├── AGENTS.md
├── Dockerfile
├── Makefile
├── requirements.txt
└── README.md
```
