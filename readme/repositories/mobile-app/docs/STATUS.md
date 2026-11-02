<p align="center">
  <img src="../assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Situação

Levantamento da main `b6419552` em 2026-10-30.

- Login PKCE, renovação, projetos, perfis, conexões e conversas têm integrações remotas. O texto antigo que negava autenticação, API e persistência estava desatualizado (2026-10-30).
- Há cinco tabelas Room, versão 3, além do DataStore. A abertura permite migração destrutiva. Confirmar retenção e preservação da fila entre versões (2026-10-30). <!-- PENDENTE: 1 -->
- Geocodificação tem endereço em QA e fica desabilitada em PROD. Hosts compilados precisam de conferência com os serviços implantados (2026-10-30). <!-- PENDENTE: 2 -->
- O workflow de release não cria artefato. Canal, assinatura e correspondência entre versão Gradle e tag precisam de definição (2026-10-30). <!-- PENDENTE: 3 -->
- Agenda e locais salvos usam `FakeDiscoveryRepository`. Chamados e notificações vêm de `FakeCommunicationRepository`, mesmo com conversas remotas. Há atalhos com identificadores de exemplo (2026-10-30). <!-- PENDENTE: 4 -->
- Firebase Installations fornece identificador, mas não há dependência Messaging, serviço FCM ou cadastro de dispositivo de push nesse código. A tela de notificações não comprova push (2026-10-30). <!-- PENDENTE: 4 -->
- A fila verifica só as últimas 100 mensagens antes de repetir uma tentativa ambígua. Isso reduz duplicação, sem estabelecer envio único (2026-10-30). <!-- PENDENTE: 5 -->
- Workers vivem no processo, sem execução durável por WorkManager após encerramento do app (2026-10-30).
- Mensagens humanas ficam no banco. Mensagens de chatbot ficam em memória e não têm a mesma disponibilidade offline (2026-10-30).
- Sair ou trocar de conta apaga o banco, inclusive envios não confirmados. Mudança de época do servidor limpa mensagens e cursor, preservando a fila nesse caso (2026-10-30).
- A revisão foi do código, sem sessão Android executada ou captura de tela. Não comprova resultado visual ou chamada integrada (2026-10-30).
