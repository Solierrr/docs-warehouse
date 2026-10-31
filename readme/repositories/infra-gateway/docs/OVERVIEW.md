<p align="center">
  <img src="../assets/readme/banners/kong.png" alt="Kong" width="100%">
</p>

# Visão de produto

O gateway permite que clientes consultem serviços de QA por uma entrada comum. Ele encaminha cada chamada ao destino correspondente e preserva o contrato da operação.

O envio de e-mails não tem rota pública no gateway de QA. As chamadas de usuário continuam sujeitas à autenticação e às permissões de cada serviço. O health do gateway informa apenas a própria entrada, sem comprovar que todos os destinos estão funcionando.
