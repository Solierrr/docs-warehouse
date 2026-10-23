<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/banners/kotlin.png" alt="Kotlin" width="100%">
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/android.png" width="100" hspace="8" alt="Android" title="Android">
  <img src="https://raw.githubusercontent.com/Solierrr/docs-warehouse/main/assets/readme/stacks/gradle.png" width="100" hspace="8" alt="Gradle" title="Gradle">
</p>

# Rodando o Projeto Localmente

Este repositório é Kotlin + Jetpack Compose (Android), buildado com Gradle. Diferente dos serviços de backend, não há `Dockerfile` nem deploy em cluster — o app roda direto em um emulador ou dispositivo físico via Android Studio. Antes de iniciar, verifique a seção de impedimentos abaixo.

## Possíveis Impedimentos

- **Android Studio instalado**, é a única IDE com suporte completo a emulador, Gradle Sync e preview de Compose — não é possível rodar o app corretamente em outra IDE.
- **JDK compatível com o Android Gradle Plugin (AGP)**, verifique a versão exigida em `gradle/libs.versions.toml` antes do primeiro sync — versões incompatíveis quebram o build silenciosamente.
- **Emulador ou dispositivo físico configurado**, um AVD (Android Virtual Device) precisa estar criado no Android Studio, ou um dispositivo físico com depuração USB habilitada.
- **Secrets locais**, chaves de API (ex: endpoints de backend, Firebase) precisam ser criadas manualmente em `local.properties` — sem elas, o app builda mas falha ao tentar se conectar em dependências externas.

## Instalação do Projeto

### Iniciando o repositório com o Github

Clone o repositório e abra no Android Studio — deixe o Gradle Sync inicial terminar antes de rodar.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
studio .
```

### Instalando dependências e rodando o projeto localmente

Use sempre o wrapper (`gradlew`/`gradlew.bat`) em vez de um Gradle instalado globalmente, para garantir a mesma versão usada no CI. Após o build, rode o app pelo próprio Android Studio (▶ Run) selecionando o emulador/dispositivo — o Gradle wrapper serve para validar o build fora da IDE.

```Comandos para instalação de dependências
./gradlew clean build
```
