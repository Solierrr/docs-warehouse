<p align="center">
  <img src="../assets/readme/banners/render.png" alt="Render" width="100%">
</p>

# Situação

Os itens refletem a leitura da `main` em 2026-10-30.

- O agendamento e o disparo manual executam o ciclo de consultas com configuração de QA no Infisical.
- O CI verifica sintaxe e o workflow de qualidade executa ShellCheck. O `Makefile` não configura testes automatizados de comportamento.
- A lista efetiva de destinos e os caminhos de health não são versionados neste repositório. Sua cobertura depende da configuração externa. <!-- PENDENTE: 1 --> <!-- PENDENTE: 2 -->
- O script registra endereços completos e não acrescenta caminho de health nem valida o conteúdo da resposta.
