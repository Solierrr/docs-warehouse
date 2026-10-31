<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- Guardrails, especialistas de recomendação, FAQ, cálculo e delegação operacional estão implementados.
- A API possui contrato exportado, resultados de turno e Agent Card.
- O `/chat` retorna a resposta inteira, sem streaming.
- O vínculo entre thread e conversa de mensagens fica em memória do processo. Reinícios podem abrir outra conversa para a mesma thread.
- O lock por thread também é local ao processo, sem coordenação distribuída.
- A atualização de fatos ocorre em tarefa de fundo, sem fila durável. A política de isolamento e retenção precisa de confirmação. <!-- PENDENTE: 2 -->
- O Dockerfile usa versão flutuante de Python. A implantação efetiva permanece por confirmar. <!-- PENDENTE: 1 -->
