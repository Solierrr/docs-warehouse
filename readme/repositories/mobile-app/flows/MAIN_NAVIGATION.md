<p align="center">
  <img src="../assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Navegação principal

A sessão determina a entrada e a navegação tipada abre as áreas do aplicativo.

```mermaid
flowchart TD
  A[Abrir aplicativo] --> B[Tela de sessão]
  B -->|Autorizado| C[Início]
  B -->|Sem sessão| D[Login pelo navegador]
  D --> B
  C --> E[Projetos]
  C --> F[Conversas]
  C --> G[Perfil e conexões]
  C --> H[Agenda e mapa]
  C --> I[Chamados e notificações]
  C --> J[Configurações e diagnóstico]
  J -->|Sair| B
```

## Falhas e limites

Remoção da sessão leva à entrada e limpa a pilha. Uma rota não comprova integração de toda a área. Atalhos da lista de conversas ainda incluem ids de exemplo.

Fonte em [implementação](https://github.com/Solierrr/mobile-app/blob/main/app/src/main/kotlin/com/project/solaria_mobile/presentation/navigation/AppNavHost.kt).
