<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="Grafana" width="100%">
</p>

# Execução local

Os painéis e as regras são arquivos de texto, e o Makefile não tem comandos de instalação, build, teste ou lint configurados, nem pastas para o `make vault`.

Para ver os painéis com dados locais, suba a stack de telemetria do coletor com `make obs-up`, como descreve o [TRY-LOCAL.md](https://github.com/Solierrr/docs-warehouse/blob/main/helps/TRY-LOCAL.md), e importe o JSON do painel desejado pela interface do Grafana local.

As regras de alerta usam a fonte de dados com uid `prometheus` e os contatos dependem da variável `API_EMAIL_KEY`, por isso um teste local precisa de uma fonte com esse uid e de uma chave de teste.
