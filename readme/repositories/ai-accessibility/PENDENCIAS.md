<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Pendências

## 1. Caminho autorizado de upload e publicação

- Onde aparece: `docs/OVERVIEW.md`, `docs/RUNNING.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: rota principal por chave de serviço, lista de chamadores vazia e cliente web que envia JWT. A decisão de aprovação não publica arquivos.
- Hipótese usada no texto: a pipeline está implementada, mas o caminho de consumo e a confirmação do texto antes da publicação não são presumidos.
- Resposta do dono: Respondido em 2026-11-01: a pessoa não confirma nada, o serviço gera a descrição sozinho e só para produtos. A ideia é processar de forma assíncrona, com o id do produto numa fila do RabbitMQ (plano no relatório do VersioSpec).
