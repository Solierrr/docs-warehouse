<p align="center">
  <img src="./assets/readme/banners/databricks.png" alt="Databricks" width="100%">
</p>

# Pendências

## 1. Contrato entre produtor e exportador

- Onde aparece em `docs/OVERVIEW.md, docs/STATUS.md e database/`.
- O que o código mostra é que o exportador fixa workspace.gold_core e nomes em português. O produtor atual usa schema gold, nomes em inglês e job no catálogo analytics.
- Hipótese usada no texto é tratar a integração como dependente de alinhamento, sem presumir aliases instalados. Confirmar fonte canônica e migração do manifesto.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 2. Hospedagem e autenticação de serviço

- Onde aparece em `docs/ARCHITECTURE.md, docs/API.md e docs/DEPLOY.md`.
- O que o código mostra é que o código usa token fixo Bearer. README diz execução local, mas o workflow confere endereço hospedado.
- Hipótese usada no texto é descrever o endereço como declarado e o token como contrato atual. Confirmar hospedagem e adoção de chave por chamador.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período. "OK, concordo plenamente". Toda rota interna exige a `X-Service-Key` de cada chamador, nenhuma depende só do gateway, e os caminhos legados saem quando os consumidores migrarem.


## 3. Governança e consistência Bronze

- Onde aparece em `docs/OVERVIEW.md, docs/STATUS.md e database/DATABRICKS.md`.
- O que o código mostra é que todas as tabelas públicas são copiadas por substituição individual. Não há lista de campos ou snapshot global. O conversor aplica padrões a tipos numéricos sem precisão ou escala verdadeiras.
- Hipótese usada no texto é não afirmar carga atômica ou anonimizada. Confirmar escopo, retenção, precisão, frequência e recuperação após falha.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.


## 4. Autorização efetiva no destino

- Onde aparece em `docs/ARCHITECTURE.md e database/POSTGRES.md`.
- O que o código mostra é que o exportador exige função externa can_read e força RLS nas tabelas. Não provisiona toda a identidade dos leitores.
- Hipótese usada no texto é documentar os pré-requisitos sem afirmar isolamento final. Confirmar função implantada, principais e privilégios de leitura e exportação.
- Resposta do dono: Respondido em 2026-11-01: "OK". O contrato Gold de referência é o do `databricks-stocker`, o bootstrap e as consultas acompanham o schema atual do `api-core`, e o backup é diário. As demais hipóteses do texto ficam como estado documentado.
