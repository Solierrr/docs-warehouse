# Templates Docker

Use os arquivos por stack quando criar ou atualizar a imagem de um serviço:

- `jvm-maven/`: Dockerfile e `.dockerignore` para aplicações Maven/JVM.
- `python/`: Dockerfile (`python:3.14-slim`, mesma versão em todos os serviços) e `.dockerignore` para serviços Python. As dependências cravadas ficam em `../python/requirements.txt`.
- `typescript/`: Dockerfile e `.dockerignore` para serviços TypeScript.
- `common/`: `.dockerignore` base independente de stack e launcher opcional de runtime para Infisical.

Os serviços atuais compartilham o mesmo princípio de runtime: quando `INFISICAL_CLIENT_ID` e `INFISICAL_CLIENT_SECRET` estão definidos, o entrypoint obtém o token Universal Auth e executa o comando da aplicação sob `infisical run`; sem essas credenciais, executa o comando diretamente. Copie e adapte `common/entrypoint.sh` apenas se esse fluxo for necessário. A imagem precisa conter o Infisical CLI para habilitar o caminho Universal Auth.

O entrypoint compartilhado assume que o `CMD` do Dockerfile fornece o comando da aplicação. Serviços com preparação especial — por exemplo, materializar um keystore a partir de uma variável — devem manter um launcher específico, executando essa preparação dentro do processo de `infisical run` quando depender de secrets.

Secrets ficam em variáveis de runtime, nunca em `ARG`, `ENV`, no contexto da imagem ou em arquivos versionados. Prefira a entrega direta de variáveis pela plataforma quando estiver disponível; o bootstrap Universal Auth é uma opção de runtime e não deve ser executado durante o build.
