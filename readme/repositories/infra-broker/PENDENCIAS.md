<p align="center">
  <img src="./assets/readme/banners/rabbitmq.png" alt="RabbitMQ" width="100%">
</p>

# Pendências

## 1. Onde o broker roda fora do ambiente local

- Onde aparece: `docs/DEPLOY.md` e `docs/STATUS.md`.
- O que o código mostra: existe imagem e workflow de publicação, mas não há manifestos, endereços ou configuração de armazenamento de QA e produção no repositório. A busca por `infra-broker` no `infra-gitops` não encontrou definição.
- Hipótese usada no texto: a publicação da imagem está preparada, mas o ambiente em que ela roda ainda não está confirmado.
- Resposta do dono:

## 2. Qual é a política de entrega e retenção dos tópicos

- Onde aparece: `docs/ARCHITECTURE.md` e `docs/STATUS.md`.
- O que o código mostra: os plugins STOMP e de administração estão habilitados, mas não há declaração de filas, exchanges, políticas ou retenção. O Compose local monta um volume.
- Hipótese usada no texto: a topologia é criada em execução, e o volume preserva os dados do processo local sem definir por si só a duração das mensagens.
- Resposta do dono:

## 3. O checklist ainda descreve este repositório como molde

- Onde aparece: `docs/STATUS.md`.
- O que o código mostra: a `main` contém imagem RabbitMQ, plugins STOMP e de administração, configuração de portas e Compose local. O checklist de documentação afirma que o repositório é um molde sem propósito.
- Hipótese usada no texto: o código atual substituiu o molde, e o checklist está desatualizado.
- Resposta do dono:
