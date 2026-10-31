<p align="center">
  <img src="./assets/readme/banners/postgresql.png" alt="PostgreSQL" width="100%">
</p>

# Pendências da documentação

As dúvidas abaixo dependem de configuração ou decisão do responsável. As hipóteses estão marcadas nos documentos. Este arquivo sai antes da cópia para o repositório de origem.

## 1. Quais ambientes e execuções estão autorizados

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/RUNNING.md`, `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: existe execução manual e cron diário condicionado a `RPA_SCHEDULE_ENABLED`. Os bancos vêm de secrets, sem ambientes nomeados no workflow. O Makefile não define `VAULT_FOLDERS`, e o engine da origem não impõe modo somente leitura. O checklist descreve a rotina como manual.
- Hipótese usada no texto: o responsável controla a autorização, os bancos, as permissões e a habilitação do agendamento fora do código. Não foi afirmado que há cron ativo ou destino de produção autorizado.
- Resposta do dono:

## 2. Qual revisão valida os preenchimentos sintéticos e os padrões

- Onde aparece: `README.md`, `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md` e `docs/STATUS.md`.
- O que o código mostra: documentos, nascimento, endereço, preço e datas ausentes recebem preenchimentos. Situação de assinatura desconhecida vira paga, renovação ausente é ativada e registro sem validade usa emissão acrescida de 3.650 dias. Não há uma etapa de aprovação desses dados.
- Hipótese usada no texto: os cadastros importados precisam de revisão pelo responsável antes do uso operacional. A rotina é descrita como carga com preenchimentos, sem presumir que eles já foram aprovados como dados de negócio.
- Resposta do dono:

## 3. Quem mantém o mapeamento e qual schema de destino é suportado

- Onde aparece: `docs/ARCHITECTURE.md`, `docs/STATUS.md` e `database/POSTGRES.md`.
- O que o código mostra: o ETL cria `rpa_id_mapping` diretamente no destino, usa regras V29 e não verifica a versão das migrations. A chave de correspondência não identifica a instância do banco de origem. O checklist previa ausência de estrutura própria.
- Hipótese usada no texto: a rotina mantém sua tabela de controle dentro do banco de negócio e coordena mudanças com o responsável pelo domínio. Compatibilidade posterior à V29 e uso de várias origens no mesmo destino não foram presumidos.
- Resposta do dono:

## 4. Como a pessoa importada recebe uma conta de acesso

- Onde aparece: `docs/OVERVIEW.md`, `docs/DEPLOY.md`, `docs/STATUS.md` e `database/POSTGRES.md`.
- O que o código mostra: `new_auth_id` gera UUID, e o ETL não escreve no `authdb`. A senha da origem não é reaproveitada. Não há comando que crie ou vincule a conta de autenticação.
- Hipótese usada no texto: o provisionamento é um procedimento separado, necessário antes de disponibilizar o login, preservando o identificador usado pelo cadastro importado.
- Resposta do dono:

## 5. Como resolver empresas com papéis ou vínculos conflitantes

- Onde aparece: `docs/OVERVIEW.md`, `docs/ARCHITECTURE.md` e `docs/STATUS.md`.
- O que o código mostra: empresa é reutilizada por CNPJ sem alterar o tipo existente. A migração de fornecedores ocorre antes da de demandantes. Um usuário já ligado a outra empresa faz o novo vínculo ser ignorado, com aviso.
- Hipótese usada no texto: o tipo existente e o vínculo já encontrado são preservados. Não foi presumido que toda empresa resultante ganha administrador nem que os dois papéis são consolidados por uma regra adicional.
- Resposta do dono:
