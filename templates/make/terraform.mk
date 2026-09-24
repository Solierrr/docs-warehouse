# Compose after base.mk. Terraform apply remains an explicit operation.
TERRAFORM ?= terraform

.PHONY: init fmt-check validate plan apply clean

init: ## Initialize Terraform providers and backend
	$(TERRAFORM) init

fmt-check: ## Check Terraform formatting
	$(TERRAFORM) fmt -check -recursive

validate: init ## Validate Terraform configuration
	$(TERRAFORM) validate

plan: init ## Show the proposed infrastructure changes
	$(TERRAFORM) plan

apply: ## Apply reviewed infrastructure changes
	$(TERRAFORM) apply

clean: ## Remove the local Terraform working directory
	@echo "No generic clean target: remove .terraform manually only when required."
