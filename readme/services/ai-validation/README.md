<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/pydantic.png" width="100" hspace="8" alt="Pydantic" title="Pydantic">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# Validação automática de documentos

[![License](https://img.shields.io/github/license/Solierrr/ai-validation)](https://github.com/Solierrr/ai-validation/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/ai-validation)](https://github.com/Solierrr/ai-validation/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/ai-validation)](https://github.com/Solierrr/ai-validation/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/ai-validation)](https://github.com/Solierrr/ai-validation/releases)

Este serviço confere documentos enviados por profissionais e empresas parceiras. A partir de uma imagem, ele lê certificados de treinamento em segurança para instalações elétricas e para trabalho em altura e verifica a validade, a carga horária e a correspondência do nome do aluno entre os documentos. Também confirma se o CNPJ de uma empresa parceira está ativo e se a atividade registrada é compatível com o setor de energia solar e elétrica.

## Ficha técnica

- **Tipo:** serviço HTTP de inteligência artificial.
- **Stack:** Python, FastAPI, LangChain e LangGraph.
- **Modelos:** Gemini e Groq.
- **Documentos:** certificados NR-10 e NR-35 e situação cadastral do CNPJ na Receita Federal.
- **Decisões:** combina consultas externas, inteligência artificial e regras fixas para reduzir resultados incorretos.
- **Ambientes:** QA no Render e produção no GKE.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/ai-validation/blob/main/docs/ARCHITECTURE.md), estrutura de pastas, camadas e padrões arquiteturais do serviço.
- [RUNNING.md](https://github.com/Solierrr/ai-validation/blob/main/docs/RUNNING.md), como rodar o projeto localmente, incluindo impedimentos e variáveis de ambiente.
- [Deployment](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), pipeline de deploy padronizado da organização (CI, release, ArgoCD).
- [docs/API.md](https://github.com/Solierrr/ai-validation/blob/main/docs/API.md), contrato completo dos endpoints, payloads e códigos de erro.
- [docs/AGENT_WORKFLOW.md](https://github.com/Solierrr/ai-validation/blob/main/docs/AGENT_WORKFLOW.md), detalhamento da pipeline multi-agente de validação de certificados.
- [docs/CNPJ_WORKFLOW.md](https://github.com/Solierrr/ai-validation/blob/main/docs/CNPJ_WORKFLOW.md), detalhamento do fluxo de validação de CNPJ.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/.github/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.

<!-- pr de teste dos comentarios automaticos, pode reverter -->

<!-- pr de teste dos comentarios automaticos, pode reverter -->
