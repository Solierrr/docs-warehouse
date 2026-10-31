<p align="center">
  <img src="../assets/readme/banners/google.png" alt="Google" width="100%">
</p>

# Visão do serviço

Este serviço reúne consultas de localização, tradução e energia solar para a plataforma. Pessoas podem conferir um endereço, obter o fuso de uma localização e consultar dados solares. Outros serviços podem traduzir textos. As respostas são devolvidas a quem consultou. O serviço não guarda esses dados.

## Capacidades

- Sugerir, detalhar, validar e localizar endereços.
- Converter endereço em coordenadas e coordenadas em endereços.
- Consultar o fuso horário de uma coordenada.
- Traduzir campos entre português, inglês e espanhol.
- Consultar os dados solares do telhado mais próximo.

## Regras observadas

As sugestões são restritas ao país solicitado, com Brasil como padrão. A tradução detecta o idioma de origem se ele não for informado e gera os demais idiomas suportados. Quando a validação externa falha após a localização, o endereço ainda é devolvido sem o parecer. A consulta solar depende da cobertura do provedor. O fuso é calculado com uma base local, sem chamada externa.

## Uso na plataforma

O aplicativo móvel em QA e o portal de QA consultam localizações. O serviço de negócio solicita traduções, e o serviço geográfico solicita dados solares. O [mapa de integrações](https://github.com/Solierrr/docs-warehouse/blob/main/docs/flows/INTEGRATIONS.md) mostra as relações entre repositórios.
