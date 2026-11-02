<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Situação

Leitura da main em 2026-11-02.

- Há quatro painéis e quinze regras de alerta, com três pontos de contato e as políticas de notificação.
- Os contatos apontam para as rotas de alerta do `api-email`, enquanto o roteamento atual dos incidentes passa pelo `worker-alerts`.
- Não há workflow que aplique os painéis e os alertas no Grafana.
- O Dockerfile, o entrypoint e o workflow de release Docker continuam com o molde, sem uma imagem de aplicação.
