<p align="center">
  <img src="../assets/readme/banners/argocd.png" alt="Argo CD" width="100%">
</p>

# Publicação no cluster

O procedimento comum está em [PROD_GKE_ARGOCD.md](https://github.com/Solierrr/docs-warehouse/blob/main/readme/deploy/PROD_GKE_ARGOCD.md). A aplicação raiz é aplicada no bootstrap do Argo CD e passa a observar a main, e a partir daí as alterações dos manifestos são sincronizadas automaticamente.

O repositório não tem uma URL única, porque cada Ingress declara o endereço da sua aplicação e os Services sem Ingress atendem apenas internamente. A disponibilidade real, o acesso ao painel e as credenciais do controlador dependem do ambiente. <!-- PENDENTE: 1 -->

Para introduzir um componente, é necessário versionar seus recursos em `services/` e sua Application em `apps/`. Secrets referenciados precisam existir no destino. O rollback consiste em revisar e reverter a configuração no Git, que o controlador volta a sincronizar.
