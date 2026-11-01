<p align="center">
  <img src="../assets/readme/banners/jetpack-compose.png" alt="Jetpack Compose" width="100%">
</p>

# Variantes e distribuição

O aplicativo é instalado em aparelho ou emulador. Não há deploy deste cliente em Render ou cluster. As variantes escolhem serviços no build.

## Destinos compilados

| Serviço | QA | PROD |
|---|---|---|
| Acesso | `https://api-auth-xw6o.onrender.com/` | `https://api-auth.solarianetwork.site/` |
| Cadastro | `https://api-core-cqfn.onrender.com/` | `https://api-core.solarianetwork.site/` |
| Mensagens | `https://api-messenger-5g2n.onrender.com/` | `https://api-messenger.solarianetwork.site/` |
| Endereços | `https://google-registry.onrender.com/` | Sem destino configurado |

QA tem identificador com sufixo `.qa`, nome e esquema de callback próprios. As variantes podem ser instaladas separadamente. Confirmar hosts de produção e contrato de endereços antes da distribuição. <!-- PENDENTE: 2 -->

## Artefatos

`make build FLAVOR=qa` gera `app/build/outputs/apk/qa/debug/app-qa-debug.apk`. PROD gera o equivalente em `prod/debug`. São builds debug e não comprovam pacote de distribuição assinado para usuários.

O workflow de release apenas informa que a publicação ainda não foi configurada. Não monta APK, assina ou publica em loja. O checklist cita uma tag antiga, mas o Gradle declara `versionName` 1.0 e `versionCode` 1. Confirmar canal, assinatura e sequência de versão. <!-- PENDENTE: 3 -->

## Atualização

Mudança da versão Room sem migração pode recriar o banco e perder mensagens pendentes. Esse caminho não representa preservação de histórico ou rascunhos. <!-- PENDENTE: 1 -->

O CI roda testes unitários de ambos os flavors com JDK 21. Não equivale a instrumentação, assinatura ou distribuição. O fluxo geral está em [release e deploy](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/RELEASE_AND_DEPLOY.md).

Fontes em [Gradle](https://github.com/Solierrr/mobile-app/blob/main/app/build.gradle.kts) e [workflow de release](https://github.com/Solierrr/mobile-app/blob/main/.github/workflows/release.yml).
