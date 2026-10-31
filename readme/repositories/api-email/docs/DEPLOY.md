<p align="center">
  <img src="../assets/readme/banners/fastify.png" alt="Fastify" width="100%">
</p>

# Deploy

O processo compartilhado está em [QA_RENDER.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/QA_RENDER.md) e [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). A imagem deste serviço compila TypeScript em Node.js 24 e executa somente os artefatos e dependências de runtime, com usuário `node`.

## Ambientes

Os destinos abaixo vêm do contrato e dos manifestos, sem comprovação de disponibilidade ao vivo.

| Ambiente | Onde | Endereço |
|---|---|---|
| Local | processo Node ou compose | [API local](http://localhost:8083) |
| QA | Render | [API de QA](https://api-email-6swz.onrender.com) |
| Produção declarada | Service interno no GKE | `http://api-email:8083`, acessível dentro do cluster |

O checklist registrava configuração incompleta no QA. A main já contém os dois transportes, mas não revela qual está ativo nem quais configurações estão presentes no Render. Essas condições precisam ser confirmadas pelo responsável. <!-- PENDENTE: 1 -->

O checklist também registrava ausência de produção. Hoje existem [aplicação Argo CD](https://github.com/Solierrr/infra-gitops/blob/main/apps/api/api-email.yaml), [Deployment](https://github.com/Solierrr/infra-gitops/blob/main/services/api-email/deployment.yaml) e [Service](https://github.com/Solierrr/infra-gitops/blob/main/services/api-email/service.yaml). O Service é `ClusterIP`, sem Ingress desse serviço no diretório. Os manifestos não comprovam que o pod esteja pronto. <!-- PENDENTE: 2 -->

## Imagem e segredos

O Dockerfile tem build em duas etapas, instala pelo lockfile e copia o pacote visual de `vendor/`. O runtime usa a porta 8083 e escuta em todas as interfaces na imagem. O `.env` não é incorporado.

O entrypoint inicia diretamente o comando quando não recebe as duas credenciais Universal Auth. Se elas estiverem presentes, tenta executar o CLI do Infisical. Esse CLI não é instalado pela imagem atual. Portanto a configuração compatível com a imagem atual é a injeção de variáveis pela plataforma. A forma adotada no QA continua pendente. <!-- PENDENTE: 1 -->

`EMAIL_FROM` e `EMAIL_ALLOWED_ORIGINS` são obrigatórios. SMTP exige host e, quando usados, usuário e senha em par. Brevo exige `BREVO_API_KEY`. `APP_ENV` distingue desenvolvimento, QA e produção e controla a exigência de HTTPS nos links. As chaves por chamador continuam necessárias em ambos os transportes.

O serviço não cria conta de provedor nem configura autorização de domínio ou DNS. Essas condições são externas ao código.

## Particularidades da produção declarada

O Deployment aponta para a imagem de versão `0.3.0`, seleciona Brevo, carrega `api-email-secrets` e declara uma réplica. Readiness e liveness ainda apontam para `/health`, portanto a prontidão do manifesto não verifica o transporte. O caminho apropriado para essa verificação no serviço é `/ready`.

O manifesto não define `DOCS_ENABLED` explicitamente. A variável pode vir do Secret, cujo conteúdo não foi consultado. A desativação da documentação em produção precisa ser confirmada. O workflow `environment-status.yml` do serviço contém somente QA. <!-- PENDENTE: 2 -->

## Publicação e operação

O push na main chama o workflow compartilhado de publicação de imagem. O release-please usa a versão de `package.json` e atualiza o contrato OpenAPI pela marca de versão. O percurso entre repositórios está em [RELEASE_AND_DEPLOY.md](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

No Render, configure `healthCheckPath` como `/ready`. Em SMTP, a checagem abre conexão e autentica sem enviar mensagem. Em Brevo, consulta o acesso à API pelo método de verificação do transporte. A resposta HTTP espera no máximo dois segundos.

O CORS permite ler a documentação a partir das origens autorizadas de QA. Isso não transforma a chave de serviço em credencial para pessoas. Os consumidores de produção devem chamar a API pelo backend.
