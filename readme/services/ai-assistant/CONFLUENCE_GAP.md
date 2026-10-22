<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/python.png" width="100" hspace="8" alt="Python" title="Python">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/mongodb.png" width="100" hspace="8" alt="MongoDB" title="MongoDB">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/qdrant.png" width="100" hspace="8" alt="Qdrant" title="Qdrant">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gemini.png" width="100" hspace="8" alt="Gemini" title="Gemini">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/groq.png" width="100" hspace="8" alt="Groq" title="Groq">
</p>

# O que o Confluence promete e o que existe

| Prometido | Situação |
|---|---|
| Roteador, Orquestrador, Guardrail e validação de alucinação | Existem (`router`, `orchestrator`, `input_guardrail` e `output_guardrail`, `judge`) |
| Especialista em placa solar, sugestor de fornecedor e de profissional, FAQ | Existem |
| Calculador solar | Existe (não estava na lista do Confluence) |
| Triagem de serviço, recomendação de categoria | Não existem neste serviço |
| Verificação profissional e de CNPJ | Não é deste serviço: é do `ai-validation` |
| Resposta em streaming | Não existe: o `/chat` devolve a resposta inteira (pode demorar; o cliente precisa de timeout maior que 60 s) |
