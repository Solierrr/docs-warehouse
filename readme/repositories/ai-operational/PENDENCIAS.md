<p align="center">
  <img src="./assets/readme/banners/fastapi.png" alt="FastAPI" width="100%">
</p>

# Pendências da documentação

Estas dúvidas dependem de configuração de ambiente ou decisão do responsável. As hipóteses estão marcadas nos documentos. Este arquivo sai antes da cópia para o repositório de origem.

## 1. Como o QA recebe os segredos atualmente

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: o contrato aponta para o Render e o workflow verifica `/ready`. A main não contém configuração do Render nem entrypoint de Infisical. O checklist de 2026-10-29 registra impedimento por falta de credenciais.
- Hipótese usada no texto: o endereço é um destino configurado, e a resolução do impedimento ainda precisa ser comprovada no painel. Não foi afirmado que o QA está disponível.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 2. Qual é a situação de produção e da continuidade do serviço

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: existem aplicação Argo CD, Deployment, Service e Ingress na main do `infra-gitops`. O Deployment usa `latest` e readiness em `/health`. O checklist registra produção ausente e pede decisão sobre manter o serviço.
- Hipótese usada no texto: os manifestos representam a configuração pretendida, sem comprovar serviço no ar nem decisão final de continuidade. O endereço de produção é apresentado como declarado.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.

## 3. Quem responde pelo banco e pela memória compartilhada

- Onde aparece: `database/MONGO.md` e `docs/STATUS.md`.
- O que o código mostra: há gravação direta em `assessor_inteligente`, checkpoints com prefixo de agente e fatos em `agent_memories` com chave somente em `user_id`. O TTL é configurado para checkpoints, mas não para fatos. O checklist previa que `database/` não se aplicaria.
- Hipótese usada no texto: o serviço é escritor de memória num banco compartilhado, sem propriedade exclusiva. A documentação cobre esse uso e deixa responsabilidade, backup e retenção dos fatos para confirmação.
- Resposta do dono: Respondido em 2026-11-01: "OK, concordo plenamente, só siga o padrão de nomenclatura para collections". Cada agente é dono da própria coleção, sem compartilhar fatos, e os fatos ficam até a exclusão da conta. Nomes em inglês, snake_case e plural, no banco `dbagents`.

## 4. Qual referência deve acompanhar a ampliação das operações

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/API.md`, `docs/STATUS.md` e `flows/ACCOUNT_QUERY.md`.
- O que o código mostra: o registro atual contém cinco tipos de ação e ferramentas HTTP de conta. Não há chamada ativa aos clientes MCP ou Redis. O mapa e o fluxo central ainda citam MCP na delegação. O catálogo central não lista os motivos já emitidos, e os metadados do OpenAPI descrevem somente criação de oferta.
- Hipótese usada no texto: a main é a referência funcional, com ações e consultas diretas documentadas. Os textos centrais e metadados permanecem como divergências, pois estão fora da pasta autorizada nesta PR.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período. A main é a referência funcional.

## 5. Quais telas e canais estão validados com a interface final

- Onde aparece: `docs/OVERVIEW.md`, `docs/STATUS.md` e `flows/ACCOUNT_QUERY.md`.
- O que o código mostra: há catálogos estáticos de telas e guias, handlers HTTP e integração A2A. A documentação de segurança da origem pede revisão dos detalhes dos guias quando a documentação do aplicativo existir.
- Hipótese usada no texto: as capacidades existem no serviço e podem ser exercitadas pelo portal de QA. Não foi afirmado que a interface final já expõe todas elas, nem foram incluídas capturas sem ambiente e dados de demonstração verificados.
- Resposta do dono: Respondido em 2026-11-01: "Tá tudo no ar". QA no Render e produção no cluster efêmero, que o dono desliga, com o `worker-failover` tratando esse período.
