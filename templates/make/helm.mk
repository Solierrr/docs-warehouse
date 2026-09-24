# Compose after base.mk. Set CHART to the chart directory.
HELM ?= helm
CHART ?= .

.PHONY: lint render

lint: ## Lint the Helm chart
	$(HELM) lint $(CHART)

render: ## Render the Helm chart locally
	$(HELM) template $(notdir $(CURDIR)) $(CHART)
