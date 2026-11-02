<p align="center">
  <img src="./assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

# Pendências da documentação

As decisões de produto já registradas foram mantidas. As dúvidas abaixo tratam de sua correspondência com o código e da operação. As hipóteses estão marcadas nos documentos. Este arquivo sai antes da cópia para o repositório de origem.

## 1. Como adequar os vínculos à decisão de várias empresas por pessoa

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/STATUS.md` e `database/POSTGRES.md`.
- O que o código mostra: `UserCompanyService` recusa segundo vínculo, RBAC resolve um vínculo e o baseline declara unicidade de `user_company.user_id`.
- Hipótese usada no texto: permanece válida a decisão de produto de várias empresas com cargos distintos. O comportamento atual de uma empresa é documentado como limitação da implementação, sem reabrir a decisão de negócio.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "Sim", uma pessoa pode pertencer a mais de uma empresa, com cargos diferentes. A adequação do vínculo único fica como tarefa de implementação.

## 2. Qual operação conecta a proposta aceita ao projeto e à execução

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/STATUS.md`, `database/POSTGRES.md` e `flows/PROPOSAL_TO_PROJECT.md`.
- O que o código mostra: o aceite reserva estoque e grava `ACCEPTED`. Projeto, serviço e contrato são criados por operações separadas, e o schema do projeto não contém uma relação de origem com proposta.
- Hipótese usada no texto: o fluxo principal de produto continua sendo unidade e fatura, proposta, aceite, projeto e contrato executado por técnico. A integração automática entre as etapas não foi afirmada como implementada.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "é", o fluxo principal é unidade e fatura, propostas, aceite, projeto e contrato executado por técnico. A conversão automática da proposta em projeto fica como tarefa de implementação.

## 3. Qual é o procedimento de adoção do schema próprio nos ambientes existentes

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/RUNNING.md`, `docs/DEPLOY.md`, `docs/STATUS.md` e `database/POSTGRES.md`.
- O que o código mostra: Flyway tem baseline V1, views V2 e referências V3, com adoção automática de baseline desligada. Nomes como `user_account` e `company_plan` diferem do schema esperado por consumidores anteriores. Textos centrais ainda atribuem o DDL ao repositório de administração de bancos.
- Hipótese usada no texto: a main é dona do DDL atual, mas bancos não vazios e consumidores antigos precisam de procedimento coordenado. A documentação não presume uma atualização automática nem compatibilidade com SQL antigo.
- Resposta do dono:

## 4. Qual contrato de validação profissional está habilitado e compatível

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/RUNNING.md`, `docs/STATUS.md` e `flows/PROFESSIONAL_VALIDATION.md`.
- O que o código mostra: o worker vem desativado, espera validação em `/api/v1/professionals/validate` e confere submissão, revisão, política, critérios e evidências. O checklist registra incompatibilidade anterior com a main do serviço externo.
- Hipótese usada no texto: a revisão manual existe e a validação automática é um caminho opcional que depende da conferência do contrato externo e da configuração. Não foi presumido que toda submissão de imagem seja processada hoje.
- Resposta do dono:

## 5. Quais revisões e integrações estão efetivamente configuradas em QA e produção

- Onde aparece: `docs/RUNNING.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: há destinos de QA e produção, Secret no Deployment, imagem `latest` e sondas TCP. O workflow verifica readiness no QA e existência de cluster em produção. O levantamento antigo registrava variáveis ausentes e branches divergentes, sem comprovação atual desses valores.
- Hipótese usada no texto: os ambientes são declarados, e a disponibilidade e a configuração de cada integração permanecem sem confirmação operacional. Não foram consultados segredos nem repetidos números antigos de divergência.
- Resposta do dono:

## 6. Qual etapa conclui a revisão do login provisório e das credenciais legadas

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/RUNNING.md`, `docs/API.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: `/dev/login` é público sem condição de perfil. E-mail, tradução e validação têm suporte à chave de serviço, mas mantêm dependências de credenciais legadas. A elegibilidade mobile interna também exige Bearer de serviço no controller.
- Hipótese usada no texto: o atalho permanece provisório conforme a decisão registrada, e as integrações ainda estão em transição. Não foi afirmado que desligar Swagger remove o atalho nem que configurar `SERVICE_KEY` elimina as condições legadas.
- Resposta do dono: Respondido no VersioSpec (2026-10-23): "dá para oficializar, entra uma pendencia". Os atalhos e as credenciais legadas estão no relatório de pendências do `api-core`.
