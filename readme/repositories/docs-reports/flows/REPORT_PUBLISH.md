<p align="center">
  <img src="../assets/readme/banners/html.png" alt="html" width="100%">
</p>

# Publicação de documento

O processo começa com escopo e especificação aprovados e termina com arquivos revisados numa PR.

```mermaid
flowchart TD
 A[Entendimento confirmado] --> B[Especificação aprovada]
 B --> C[Conteúdo e HTML fonte]
 C --> D[Build e verificação estrutural]
 D --> E[Revisão visual independente]
 E --> F{Aprovado?}
 F -->|não| C
 F -->|sim| G[PDF e conferência final]
 G --> H[PR do documento]
 H --> I[Main e galeria]
```

Sem aprovação de escopo, a autoria não começa. Falha estrutural, paginação incompleta ou revisão visual pendente impede declarar o documento pronto. Após três ciclos sem convergência, o processo volta ao responsável. O PDF exige um navegador disponível.
