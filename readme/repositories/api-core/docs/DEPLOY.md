<p align="center">
  <img src="../assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

# Deploy

O processo comum está em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). A imagem compila com JDK 21 e executa com JRE 21.

## Ambientes

Os endereços são declarados no contrato e na infraestrutura. A disponibilidade não foi testada durante esta documentação.

| Ambiente | Onde | Endereço |
|---|---|---|
| Local | processo Java | [API local](http://localhost:8080) |
| QA | Render | [API de QA](https://api-core-cqfn.onrender.com) |
| Produção declarada | GKE e Kong | [API de produção](https://core.solarianetwork.site) |

O checklist anterior registrava QA e produção disponíveis, mas também variáveis ausentes e divergência entre branches. O código atual não comprova quais valores estão configurados nem a revisão implantada. Essas condições ficam pendentes de conferência operacional. <!-- PENDENTE: 5 -->

## Partida e banco

A imagem de runtime inclui o Infisical CLI, e o `entrypoint.sh` usa Universal Auth quando recebe as duas credenciais correspondentes e, sem elas, inicia com as variáveis já injetadas, sem que nenhum segredo entre na imagem.

A partida agora aplica Flyway e valida as entidades. Em um banco novo, V1 a V3 criam o schema e as referências. Em banco existente, a estratégia de baseline e a compatibilidade dos consumidores precisam ser definidas antes da promoção dessa revisão. `baseline-on-migrate` está desativado. <!-- PENDENTE: 3 -->

PostgreSQL e as propriedades obrigatórias de integração precisam estar acessíveis na partida. Redis é usado como cache com fallback. Cloudinary recebe credenciais próprias, e as integrações HTTP leem nomes e chaves descritos em [RUNNING.md](./RUNNING.md).

## Infraestrutura declarada

O [Deployment](https://github.com/Solierrr/infra-gitops/blob/main/services/api-core/deployment.yaml) usa uma réplica, porta 8080, Secret `api-core-secrets` e ajustes de pool para reduzir conexões PostgreSQL. JWKS e e-mail têm destinos internos declarados. O [Ingress](https://github.com/Solierrr/infra-gitops/blob/main/services/api-core/ingress.yaml) aponta ao Service pelo Kong.

O manifesto ainda usa `latest` e sondas TCP para startup, liveness e readiness. Essas sondas verificam abertura da porta e não reproduzem o readiness PostgreSQL da aplicação. Os caminhos HTTP do serviço são `/actuator/health/liveness` e `/actuator/health/readiness`. A versão efetiva e a adoção das sondas precisam ser conferidas com o responsável. <!-- PENDENTE: 5 -->

O manifesto consultado não define `DOCS_ENABLED` explicitamente, e essa configuração pode vir do Secret, cujo conteúdo não foi consultado. Desligar o Swagger também não remove o controller `/dev/login`, e a revisão desse atalho continua registrada como decisão pendente. <!-- PENDENTE: 6 -->

## Publicação e observabilidade

Os workflows reutilizam a publicação de imagem e o release-please da organização, e a versão do `pom.xml` acompanha o OpenAPI e o build info. O fluxo geral está em [RELEASE_AND_DEPLOY.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

`environment-status.yml` consulta readiness no QA e verifica o cluster no job de produção. A existência do cluster não comprova a prontidão deste serviço. O endpoint OTLP, a identidade de ambiente e a versão de telemetria vêm da configuração do processo.

Rollback de imagem não desfaz migrations nem dados de negócio. O repositório não fornece uma reversão automática do baseline. A recuperação do banco deve acompanhar o procedimento operacional definido para o ambiente. <!-- PENDENTE: 3 -->
