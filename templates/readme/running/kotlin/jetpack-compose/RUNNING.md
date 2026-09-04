# Rodando o Projeto Localmente

Este repositório é Kotlin + Jetpack Compose (Android), buildado com Gradle. Diferente dos serviços de backend, não há `Dockerfile` nem deploy em cluster — o app roda direto em um emulador ou dispositivo físico via Android Studio. Antes de iniciar, verifique a seção de impedimentos abaixo.

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=kotlin,android,androidstudio,jetpackcompose,github" height="48" alt="Rodando o Projeto — Jetpack Compose">
  </a>
</p>

## Possíveis Impedimentos

- **Android Studio instalado**, é a única IDE com suporte completo a emulador, Gradle Sync e preview de Compose — não é possível rodar o app corretamente em outra IDE.
- **JDK compatível com o Android Gradle Plugin (AGP)**, verifique a versão exigida em `gradle/libs.versions.toml` antes do primeiro sync — versões incompatíveis quebram o build silenciosamente.
- **Emulador ou dispositivo físico configurado**, um AVD (Android Virtual Device) precisa estar criado no Android Studio, ou um dispositivo físico com depuração USB habilitada.
- **Secrets locais**, chaves de API (ex: endpoints de backend, Firebase) precisam ser criadas manualmente em `local.properties` — sem elas, o app builda mas falha ao tentar se conectar em dependências externas.

## Instalação do Projeto

### Iniciando o repositório com o Github

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=github,androidstudio" height="48" alt="Frameworks">
  </a>
</p>

Clone o repositório e abra no Android Studio — deixe o Gradle Sync inicial terminar antes de rodar.

```Comandos para clonar o repositório
git clone https://github.com/Solierrr/<repo>.git
cd ./<repo>
studio .
```

### Instalando dependências e rodando o projeto localmente

<p>
  <a href="https://github.com/syvixor/skills-icons">
    <img src="https://skills.syvixor.com/api/icons?i=gradle" height="48" alt="Frameworks">
  </a>
</p>

Use sempre o wrapper (`gradlew`/`gradlew.bat`) em vez de um Gradle instalado globalmente, para garantir a mesma versão usada no CI. Após o build, rode o app pelo próprio Android Studio (▶ Run) selecionando o emulador/dispositivo — o Gradle wrapper serve para validar o build fora da IDE.

```Comandos para instalação de dependências
./gradlew clean build
```
