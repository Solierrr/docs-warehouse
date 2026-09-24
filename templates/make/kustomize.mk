# Compose after base.mk. Set KUSTOMIZE_DIR to a kustomization directory.
KUBECTL ?= kubectl
KUSTOMIZE_DIR ?= .

.PHONY: render validate

render: ## Render the Kustomize manifests
	$(KUBECTL) kustomize $(KUSTOMIZE_DIR)

validate: ## Validate rendered manifests locally
	$(KUBECTL) kustomize $(KUSTOMIZE_DIR) | $(KUBECTL) apply --dry-run=client -f -
