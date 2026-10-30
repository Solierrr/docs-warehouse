<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Situação

Levantamento da main `7855fc9f` em 2026-10-30.

- Há rotas de certificados, CNPJ, saúde e debug, com testes por domínio e exportação OpenAPI (2026-10-30).
- Não há `professional_routes` ou `/api/v1/professionals/validate` nesta main. O contrato esperado pelo cadastro central continua pendente. A existência do helper de chave não resolve a integração (2026-10-30). <!-- PENDENTE: 1 -->
- Os critérios numéricos e o tratamento de datas são regras implementadas e precisam de confirmação da política de aceitação do produto (2026-10-30). <!-- PENDENTE: 2 -->
- O texto do bootstrap descreve validação pública, mas os routers exigem JWT com `AUTH_REQUIRED` ativo por padrão. Exposição e configuração atuais de QA e PROD não foram consultadas (2026-10-30). <!-- PENDENTE: 3 -->
- O Dockerfile usa Python sem versão fixa e as dependências majoritariamente não têm versão fixada. A biblioteca compartilhada agora vem de faixa no índice, contrariando o SHA antigo citado no checklist (2026-10-30).
- Imagens são baixadas por URLs HTTP ou HTTPS, com redirects e sem limite de bytes ou política de origem explícitos no caminho analisado (2026-10-30). <!-- PENDENTE: 4 -->
- Datas ausentes ou ilegíveis não causam reprovação independente na consolidação. Ela mantém a decisão do especialista. Nomes são comparados entre documentos, sem comparação com a identidade do JWT (2026-10-30).
- Algumas falhas de modelo e download são convertidas em reprovação de documento. Uma resposta 200 reprovada não comprova que o documento foi analisado com sucesso (2026-10-30).
- Debug guarda checkpoints em memória. O controle descarta execuções antigas e limita o conjunto, mas pode manter uma única execução acima do tamanho de referência. Não há banco persistente de execuções (2026-10-30).
- Readiness não confere modelos, JWKS ou BrasilAPI. O status do cluster não comprova uma validação funcional (2026-10-30).
