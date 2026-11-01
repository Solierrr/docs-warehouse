<p align="center">
  <img src="../assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Execução local

Usar JDK 21, como no CI, Android SDK com plataforma 37, build tools compatíveis e emulador ou aparelho com API 29 ou superior. O catálogo declara AGP 9.3.3, Kotlin 2.4.20 e Compose BOM 2026.09.00. O wrapper fixa Gradle 9.7.1. A compatibilidade de bytecode Java 11 é distinta do JDK de build.

O guia comum está em [Kotlin e Compose](https://github.com/Solierrr/docs-warehouse/blob/main/readme/running/KOTLIN_JETPACK_COMPOSE.md). Neste aplicativo, URLs vêm do flavor Gradle, sem leitura automática de `.env` ou `local.properties` para os destinos.

## Preparar e instalar

Executar no checkout do aplicativo. No Windows, usar Git Bash para make ou `gradlew.bat` nas tarefas diretas.

```bash
make doctor
make install
make devices
make dev FLAVOR=qa
```

`make dev` constrói, instala o APK debug e abre a Activity. `DEVICE` seleciona um aparelho. `make avds` lista emuladores e `make emulator AVD=nome` inicia um AVD. Android Studio também permite escolher a variante.

`make vault` exporta `/service-urls`, mas o build não usa esse arquivo para trocar `BuildConfig`. Não colocar chaves de serviço no aplicativo. Obter `google-services.json` pelo procedimento autorizado e manter fora do versionamento. O plugin correspondente só é aplicado quando um dos arquivos previstos existe.

## Build e testes

Os alvos usam QA por padrão.

```bash
make build FLAVOR=qa
make build FLAVOR=prod
make test
make lint FLAVOR=qa
./gradlew connectedQaDebugAndroidTest
```

`make test` roda `testQaDebugUnitTest` e `testProdDebugUnitTest`. O lint usa ktlint e Android lint. Instrumentação exige dispositivo. Não há alvo OpenAPI ou servidor local do app.

Testes JVM cobrem autenticação, fila, sincronização, presença, leitura, projetos e perfil. O smoke de navegação fica em `app/src/androidTest/`.

## Conferir uma sessão

Abrir QA, autorizar no navegador e aguardar o callback. Conferir projetos, perfil e conversas com dados sintéticos autorizados. Para conferir a fila, preparar mensagem sem rede, restaurar a conexão e acompanhar a confirmação.

QA pode precisar acordar o servidor. Falha de callback exige conferir variante, redirect e state. Endereço compilado não muda pela troca de variável no servidor. Confirmar URLs de produção e geocodificação. <!-- PENDENTE: 2 -->

Fontes em [Makefile](https://github.com/Solierrr/mobile-app/blob/main/Makefile), [CI](https://github.com/Solierrr/mobile-app/blob/main/.github/workflows/ci.yml), [versões](https://github.com/Solierrr/mobile-app/blob/main/gradle/libs.versions.toml) e [wrapper](https://github.com/Solierrr/mobile-app/blob/main/gradle/wrapper/gradle-wrapper.properties).
