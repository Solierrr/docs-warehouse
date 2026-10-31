<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Contrato de encaminhamento

Não existe OpenAPI próprio do proxy. Os contratos pertencem aos serviços de destino. No QA, uma chamada para `/<serviço>/<caminho>` tem o primeiro prefixo removido antes do envio.

A rota `/health` termina localmente com status 200 e corpo de processo ativo. Ela não consulta upstreams. As demais rotas encaminham cabeçalhos e métodos conforme o Kong e os plugins configurados.

O gateway não valida JWT nesta configuração. A autenticação ocorre no serviço. CORS não autoriza uma operação por si só. O [padrão de chamada entre serviços](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/SERVICE_TO_SERVICE_AUTH.md) continua aplicável aos destinos.
