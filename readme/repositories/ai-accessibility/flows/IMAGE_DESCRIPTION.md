<p align="center">
  <img src="../assets/readme/banners/fastapi.png" alt="fastapi" width="100%">
</p>

# Análise e descrição

O fluxo recebe uma imagem e devolve decisão com descrição apenas quando as etapas permitem aprovação.

```mermaid
flowchart TD
 A[Autentica e limita upload] --> B[Valida e normaliza imagem]
 B --> C[Consulta sinais de visão]
 C --> D{Política aprova?}
 D -->|não| E[Rejeita ou pede revisão]
 D -->|sim| F[Gera legenda]
 F --> G{Legenda válida?}
 G -->|não| E
 G -->|sim| H[Aprova com texto alternativo]
```

Arquivo inválido impede a análise. Incerteza, risco ou bloqueio de segurança exige revisão. Falha técnica pode usar o provedor alternativo, mas não autoriza contornar um bloqueio de segurança. O serviço não publica a imagem após a aprovação.
