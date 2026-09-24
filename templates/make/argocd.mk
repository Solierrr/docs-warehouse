# Compose after base.mk. Set MANIFEST or APP for validation against a target.
KUBECTL ?= kubectl
ARGOCD ?= argocd
MANIFEST ?=
APP ?=

.PHONY: validate diff

validate: ## Validate MANIFEST locally (MANIFEST=services/api-core/deployment.yaml)
	@test -n "$(MANIFEST)" || { echo "error: set MANIFEST"; exit 1; }
	$(KUBECTL) apply --dry-run=client -f $(MANIFEST)

diff: ## Show cluster diff for APP (APP=api-core)
	@test -n "$(APP)" || { echo "error: set APP"; exit 1; }
	$(ARGOCD) app diff $(APP)
