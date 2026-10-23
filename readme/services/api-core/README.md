<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/springboot.png" alt="Spring Boot" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/java.png" width="100" hspace="8" alt="Java" title="Java">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/spring-security.png" width="100" hspace="8" alt="Spring Security" title="Spring Security">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/jwt.png" width="100" hspace="8" alt="JWT" title="JWT">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/postgresql.png" width="100" hspace="8" alt="PostgreSQL" title="PostgreSQL">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/redis.png" width="100" hspace="8" alt="Redis" title="Redis">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/cloudinary.png" width="100" hspace="8" alt="Cloudinary" title="Cloudinary">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/swagger.png" width="100" hspace="8" alt="Swagger" title="Swagger">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/bruno.png" width="100" hspace="8" alt="Bruno" title="Bruno">
</p>

# Cadastro central da plataforma

[![License](https://img.shields.io/github/license/Solierrr/api-core)](https://github.com/Solierrr/api-core/blob/main/LICENSE)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/Solierrr/api-core)](https://github.com/Solierrr/api-core/commits)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/Solierrr/api-core)](https://github.com/Solierrr/api-core/pulls)
[![Release](https://img.shields.io/github/v/release/Solierrr/api-core)](https://github.com/Solierrr/api-core/releases)

Este serviço é o cadastro central da plataforma. Ele foi idealizado para reunir em um único lugar as informações que sustentam a operação de energia solar, como empresas, profissionais, fornecedores, produtos ofertados, propostas, projetos, pedidos e unidades consumidoras com as suas faturas de energia. Dessa forma, os aplicativos e os demais serviços consultam e atualizam os mesmos dados, e cada pessoa vê e altera apenas o que o seu papel na empresa permite.

O serviço não faz login. Cada requisição chega com um token JWT emitido pelo serviço de acesso e é validada pela chave pública dele, e as contas novas são criadas aqui a partir de um pedido interno desse mesmo serviço. Os dados ficam em um banco PostgreSQL próprio, na mesma instância usada pelo serviço de acesso, e a estrutura das tabelas é mantida em um repositório separado, de modo que o serviço apenas confere essa estrutura ao iniciar. O Redis guarda em cache as buscas de fornecedores mais procuradas. As fotos, os documentos de profissionais e as faturas de energia ficam armazenados no Cloudinary. As traduções das ofertas passam pelo serviço de integração com o Google, os documentos profissionais são conferidos pelo serviço de validação com inteligência artificial e os convites de projeto são enviados pelo serviço de e-mail.

## Aprofunde-se no Projeto!

- [ARCHITECTURE.md](https://github.com/Solierrr/api-core/blob/main/docs/ARCHITECTURE.md), organização do código, camadas e estrutura do repositório.
- [RUNNING.md](https://github.com/Solierrr/api-core/blob/main/docs/RUNNING.md), como executar o serviço localmente.
- [DEPLOYMENT.md](https://github.com/Solierrr/docs-warehouse/blob/main/.github/DEPLOYMENT.md), processo de publicação nos ambientes de testes e de produção.

## Contribuindo

- [CONTRIBUTING.md](https://github.com/Solierrr/api-core/blob/main/.github/CONTRIBUTING.md), convenções de commit, branch e Pull Request.
- [CODE_OF_CONDUCT.md](https://github.com/Solierrr/.github/blob/main/CODE_OF_CONDUCT.md), código de conduta do projeto.
- [SECURITY.md](https://github.com/Solierrr/.github/blob/main/SECURITY.md), como reportar vulnerabilidades de segurança.
