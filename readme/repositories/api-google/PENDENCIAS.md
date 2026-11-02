<p align="center">
  <img src="./assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Pendências

Dúvidas que a implementação e o checklist não resolvem. A hipótese de cada item está marcada no documento correspondente.

## 1. Quando as rotas antigas serão encerradas

- Onde aparece: `docs/API.md` e `docs/STATUS.md`.
- O que o código mostra: `/v1/i18n/translate` e `/v1/solar/roof-viability` continuam abertas, marcadas como obsoletas e fora do contrato.
- Hipótese usada no texto: elas permanecem durante a migração dos chamadores para `/internal`.
- Resposta do dono: Respondido em 2026-11-01: "OK, concordo plenamente". Toda rota interna exige a `X-Service-Key` de cada chamador, nenhuma depende só do gateway, e os caminhos legados saem quando os consumidores migrarem.

## 2. Qual é o escopo do Calendar

- Onde aparece: `docs/ARCHITECTURE.md` e `docs/STATUS.md`.
- O que o código mostra: há cliente de token e configurações OAuth obrigatórias, mas nenhuma rota chama o cliente.
- Hipótese usada no texto: a integração ainda não atende requisições.
- Resposta do dono: Respondido em 2026-11-01: o Calendar "está" no escopo.

## 3. Como o aplicativo acessará o serviço em PROD

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o checklist mostra: o serviço é interno no GKE, e o aplicativo de PROD não tem endereço configurado.
- Hipótese usada no texto: não há URL pública confirmada para acesso direto.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 4. Qual nome será adotado na publicação

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o checklist mostra: repositório, Render, imagem e manifestos usam nomes diferentes.
- Hipótese usada no texto: a divergência permanece até uma decisão de padronização.
- Resposta do dono: Respondido em 2026-11-01: "o nome mudou para api-google, era google-registry".
