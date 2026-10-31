<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Situação

Leitura da main em 2026-10-31.

- Há entrada comum de QA, rota local de health, correlação, CORS e timeout de mensagens.
- Não há rate limiting ou autenticação JWT declarados nessa configuração.
- O CI renderiza charts sem fixar sua versão e valida o arquivo DB-less.
- Os valores base e prod usam níveis diferentes de agrupamento. A aplicação efetiva depende do chart e de seu consumidor. <!-- PENDENTE: 1 -->
- O destino `google-registry` mantém nome antigo no arquivo de QA.
