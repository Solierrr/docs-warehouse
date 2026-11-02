<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Visão de produto

A visualização operacional permite à equipe consultar as métricas, os registros e os rastros dos serviços e receber um aviso quando algo sai do normal.

## O que a equipe consegue fazer

- Ver a saúde geral da plataforma, com requisições por segundo, taxa de erros 5xx, maior latência p95 e serviços sem dados.
- Abrir o painel de um serviço Java ou Python e acompanhar requisições, erros, latências p95 e p99 e a saúde de cada pod.
- Investigar erros no painel de análise, com os erros 5xx do período, os serviços afetados e os erros de negócio registrados nos logs.
- Receber alertas de serviço sem dados, erros 5xx, latência alta, pool de conexões saturado, heap da JVM no limite, provedor de IA indisponível, usuário não provisionado e acessos negados em massa.

## Regras

Cada alerta tem uma prioridade, de P1 a P5, e o link do alerta abre o painel do serviço afetado, escolhido pela linguagem do serviço. Os alertas de um mesmo problema são agrupados por alerta, serviço e ambiente e repetidos a cada 35 minutos enquanto continuam ativos. Os de prioridade P1 também vão por e-mail a cada hora, e os de P2 a cada quatro horas.
