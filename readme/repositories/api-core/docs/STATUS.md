<p align="center">
  <img src="../assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

# Situação

O levantamento usa a main em 2026-10-30. Implementação disponível no código e configuração declarada não são prova de fluxo integrado executado ou ambiente disponível.

## Presente no código

- Domínios de identidade, empresa, unidade, catálogo, proposta, execução, profissional, pedidos e recomendação, com contrato exportado de 254 caminhos (2026-10-30).
- Flyway com baseline de 68 tabelas, 53 índices explícitos, views de exportação e dados de referência. O DDL já pertence ao serviço, contrariando os textos antigos que o colocavam fora da aplicação (2026-10-30).
- Autenticação JWT, chaves por consumidor interno, RBAC, acesso de projeto e controle específico de ações mobile (2026-10-30).
- Negociação com alternância de partes e aceite que reserva estoque sob locks. Checkout e cancelamento de pedido mantêm snapshots e estados de pagamento em transação (2026-10-30).
- Projetos com membros, convites, agenda, histórico, fotos e consulta interna de acesso para o serviço de conversas (2026-10-30).
- Onboarding profissional versionado, evidências, decisão administrativa e worker automático opcional (2026-10-30).
- Filas duráveis de tradução e de processamento profissional, tentativas de e-mail do convite e fallback relacional de recomendações (2026-10-30).
- Cache Redis seletivo, arquivos com armazenamento por domínio, OpenAPI, health, build info e observabilidade OTLP (2026-10-30).

## Diferenças em relação às decisões de produto

- O produto admite várias empresas por pessoa. `UserCompanyService`, RBAC e `uq_user_company_user` ainda trabalham com um vínculo. A adequação a vários vínculos está pendente (2026-10-30).
- O fluxo principal de proposta para projeto é uma decisão de produto. O aceite atual muda o estado e reserva estoque, sem criar automaticamente projeto, serviço ou contrato. Esses recursos têm operações separadas (2026-10-30).

## Integrações e operação pendentes de confirmação

- Bancos já existentes e consumidores do schema anterior precisam acompanhar a nova sequência Flyway. Os nomes de tabela e colunas mudaram, e a adoção automática de baseline está desativada (2026-10-30). <!-- PENDENTE: 3 -->
- A validação profissional automática vem desativada por padrão. O worker exige contrato externo específico, credencial legada e chave de serviço quando configurada. A compatibilidade deve ser confirmada antes de habilitá-lo. Itens de fila não são processados por esse worker enquanto ele estiver desligado (2026-10-30). <!-- PENDENTE: 4 -->
- O checklist registrava integrações sem variáveis em produção e divergência entre QA e main. O estado atual dos secrets e a revisão implantada não foram consultados. Os números antigos de divergência não foram reutilizados como estado atual (2026-10-30). <!-- PENDENTE: 5 -->
- O manifesto de produção consultado usa `latest` e sondas TCP. O job de ambiente confirma o cluster, sem comprovar health HTTP do serviço (2026-10-30). <!-- PENDENTE: 5 -->
- `/dev/login` continua público e sem perfil específico, até a oficialização dos atalhos de autenticação. Clientes de e-mail e tradução ainda dependem de credenciais legadas para iniciar ou executar. Elegibilidade mobile interna exige um Bearer adicional à chave de serviço (2026-10-30).

## Limitações técnicas

- O cache Redis expira por TTL e não é uma fonte de negócio. O cache de recomendações é local ao processo, portanto não é compartilhado entre réplicas (2026-10-30).
- Tradução, validação e envio de e-mail não fazem parte do readiness. Um banco pronto não comprova a disponibilidade dessas integrações (2026-10-30).
- A chain interna usa entrypoint de autenticação também na negativa de autorização. Esse caminho pode devolver 401 para chave válida fora do escopo, em divergência com o 403 previsto no padrão (2026-10-30).
- O catálogo público de técnicos filtra pelo estado aprovado. A revisão administrativa e a integração automática não devem ser descritas como a mesma etapa ou como validação automática sempre ativa (2026-10-30).
- Fotos de projeto ficam em bytes no PostgreSQL, e documentos profissionais podem estar no banco ou no Cloudinary autenticado. O texto antigo que colocava todos os arquivos no Cloudinary era impreciso (2026-10-30).
- Não foi encontrada chamada ativa ao serviço de notificações na integração analisada. Agendamento ou conclusão de serviço não comprova envio de push por este repositório (2026-10-30).
