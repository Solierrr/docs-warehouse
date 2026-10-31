<p align="center">
  <img src="../assets/readme/banners/grafana.png" alt="grafana" width="100%">
</p>

# Inspeção local

O Makefile exige `make`, shell e Git, mas instalação, desenvolvimento, build, teste e lint não têm comandos configurados. `make vault` também não tem pastas definidas.

Não há instrução válida para iniciar uma instância Grafana a partir desta main, pois o Dockerfile não define imagem base ou comando. A coleção Bruno contém exemplos de outro tipo de serviço e não representa uma API implementada aqui.

Para uma visualização local de telemetria, o procedimento existente é `make obs-up` no repositório do coletor, descrito em [TRY-LOCAL.md](https://github.com/Solierrr/docs-warehouse/blob/main/helps/TRY-LOCAL.md). Esse procedimento não usa este repositório.
