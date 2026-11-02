<p align="center">
  <img src="../assets/readme/banners/hono.png" alt="Hono" width="100%">
</p>

# Visão de produto

A central de alertas existe para que a equipe saiba de um problema em produção por um caminho que não depende da própria plataforma estar de pé. Ela recebe os alertas do monitoramento, abre um incidente no quadro de trabalho do time responsável pelo serviço afetado e registra quando o problema termina, deixando o histórico de cada ocorrência num só lugar.

## O que a equipe recebe

- Um ticket novo no Jira quando um alerta dispara, já com o resumo do problema, o impacto, o serviço, o ambiente e o link do painel de monitoramento.
- Um comentário no ticket existente quando o mesmo alerta volta a disparar em pouco tempo, em vez de um ticket repetido.
- O registro do fim do incidente, com a duração, quando o monitoramento avisa que o problema foi resolvido.
- Um e-mail para a equipe quando um ticket de prioridade P1 ou P2 é aberto ou encerrado.
- Um incidente próprio quando o monitoramento para de mandar sinal ou quando um serviço principal deixa de responder.

## Regras de negócio

- Só os alertas do ambiente de produção viram ticket, porque os ambientes de testes geram ruído e não pedem resposta imediata da equipe.
- Um alerta só abre ticket novo se o último ticket do mesmo alerta, serviço e ambiente tiver pelo menos 30 minutos, o que evita que uma instabilidade curta encha o quadro de tickets.
- Em 24 horas, o mesmo alerta abre no máximo 8 tickets, e a partir daí cada novo disparo vira um comentário no último ticket aberto.
- O serviço registra o fim do incidente com uma etiqueta e um comentário, mas nunca muda a situação nem fecha o ticket, porque encerrar o trabalho continua sendo uma decisão de quem atendeu.
- Cada serviço tem um quadro de destino, e um serviço sem destino cadastrado vai para o quadro padrão, para que nenhum alerta se perca.
- Os alertas de infraestrutura, como banco de grafos, gateway, cluster, monitoramento e entrega contínua, vão para o quadro de banco de dados e infraestrutura.
- Um alerta marcado como teste abre o ticket com a marca de teste no título e nunca envia e-mail.
- Enquanto o cluster está desligado de propósito, e por mais 30 minutos depois que ele volta, os alertas de "serviço sem dados" não abrem ticket, porque a falta de dados é esperada nesse período.
- O e-mail é um aviso de melhor esforço e acompanha o ticket, por isso sai só quando o ticket é aberto ou encerrado, e uma falha no envio não impede o registro no Jira.

## Quadros de destino

O destino de cada serviço fica declarado no próprio repositório do serviço, e este serviço reúne essas declarações numa tabela única. A tabela é conferida todos os dias e a cada mudança, para que um serviço novo ou um destino alterado não fiquem de fora.

| Quadro | O que recebe |
|---|---|
| Desenvolvimento | os serviços de aplicação, como acesso, cadastro, mensagens, notificações, recomendação, e-mail, integração com o Google e a aplicação web |
| Banco de dados e infraestrutura | o banco de grafos e a rotina que o monta, a consulta de dados para os assistentes, o gateway, o cluster, o coletor de telemetria, a entrega contínua e o próprio monitoramento quando ele para de mandar sinal |
| Inteligência artificial | os assistentes e os serviços de validação com inteligência artificial |
