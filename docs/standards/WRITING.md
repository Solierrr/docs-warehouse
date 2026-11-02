# Escrita da documentação

Regras para todo texto que vai para os repositórios, ou seja, README, `docs/`, `flows/` e `database/`. Os documentos de padrão desta pasta não seguem todas elas, porque são normas internas.

## Tom

- Português formal e direto, em frases declarativas completas.
- Sem períodos curtos demais. Um parágrafo não é uma sequência de frases de quatro ou cinco palavras, como "O serviço usa Redis. O cache dura 12 minutos. A chave é o filtro.". Ideias da mesma linha vão na mesma frase, ligadas por vírgula ou conectivo ("porque", "quando", "e", "mas", "enquanto"), como "O serviço guarda em cache do Redis, por 12 minutos, as buscas mais repetidas, usando o filtro como chave". Na média, cada frase do parágrafo fica entre 12 e 25 palavras.
- Descrever o que existe hoje. Sem promessa, sem roadmap no texto e sem suspense ("antes mesmo de", "nunca fica vazio").
- Explicar o porquê junto com o quê. "As notificações ficam 90 dias porque o app só mostra o último trimestre" vale mais que "as notificações têm retenção configurável".
- Exemplo real, tirado do código ou da tela, no lugar de exemplo genérico.
- O projeto é documentado como um produto profissional. Pagamentos, pedidos, planos e cobranças são descritos como transações, sem qualificar como teste ou simulação.

## Nome do projeto e da organização

O nome do projeto e o da organização não aparecem em título, texto, `alt` de imagem nem texto de link. Usar "a plataforma", "o projeto", "a organização", "este serviço" ou "este repositório". Eles só aparecem dentro de URLs.

## Pontuação

- Sem dois-pontos no meio da frase. "O serviço faz duas coisas: X e Y" vira "O serviço faz X e Y".
- Sem rótulo em negrito seguido de dois-pontos em lista (`**Termo:** explicação`). Cada item de lista é uma frase completa.
- Dois-pontos só antes de uma lista ou de um bloco de código, e só quando reescrever a frase deixaria o texto torto.
- Sem ponto e vírgula. Dividir em duas frases.
- Sem travessão (—). Usar vírgula, parênteses ou outra frase.

## O que soa como texto gerado

Cortar ao revisar:

- Palavras de enfeite, como robusto, escalável, poderoso, eficiente, moderno, intuitivo, completo, sólido, abrangente, seamless e de ponta.
- Verbos vazios, como garantir, aproveitar, potencializar, alavancar, otimizar e facilitar, quando não dizem o que acontece de fato.
- Trios de adjetivos ("rápido, seguro e confiável").
- Frase de efeito no fim do parágrafo ("tudo isso de forma simples").
- Abertura que anuncia o texto ("Neste documento você vai encontrar", "Vamos explorar").
- Seções "Introdução" e "Conclusão".
- Resumo repetindo o que acabou de ser dito.
- Emoji.
- Negrito espalhado. Negrito só para um termo que a pessoa precisa achar de relance.
- Frases que mencionam a própria seção ("os detalhes estão na seção abaixo").

## Termos técnicos

- No parágrafo de contexto do README e no `OVERVIEW.md`, nada de rota, tabela, classe, variável, fila, sigla interna ou nome de arquivo. Tecnologias conhecidas (Firebase, JWT, PostgreSQL, Redis) podem aparecer quando explicam o funcionamento.
- Nos documentos técnicos, nomes de código vão entre crases (`ProjectService`, `/notify/devices`, `SERVICE_KEY`).
- Termos que a equipe fala em inglês ficam em inglês (deploy, token, endpoint, health check, release). O resto é em português.

## Listas e tabelas

- Começar com parágrafo e só depois usar lista.
- Lista com marcador para itens sem ordem e lista numerada para passos.
- Tabela quando a mesma informação se repete para vários itens (integrações, variáveis, ambientes).

## Dúvidas

O que o código não responde não é inventado. A dúvida vai para o `PENDENCIAS.md` do repositório, o texto usa a hipótese mais provável e o trecho recebe `<!-- PENDENTE: <número> -->`.

## Revisão

- [ ] Li o texto em voz alta e cortei o que soou genérico ou que serviria para qualquer projeto.
- [ ] Nenhuma palavra da lista de enfeites.
- [ ] Nenhum dois-pontos no meio de frase, nenhum `**Termo:**`, nenhum ponto e vírgula, nenhum travessão.
- [ ] Nenhum parágrafo picotado em frases curtas. A média de cada parágrafo fica entre 12 e 25 palavras por frase.
- [ ] Nenhuma menção ao nome do projeto ou da organização fora de URL.
- [ ] Cada afirmação tem base no código, numa decisão registrada ou está marcada como pendente.
- [ ] O `OVERVIEW.md` e o contexto do README fazem sentido para quem não programa.
