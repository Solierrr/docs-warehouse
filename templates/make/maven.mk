# Compose after base.mk. Requires the Maven wrapper committed in the repository.
MVNW ?= ./mvnw

.PHONY: setup run build test check clean

setup: ## Download Maven dependencies through the wrapper
	$(MVNW) dependency:go-offline

run: ## Start the Spring Boot application
	$(MVNW) spring-boot:run

build: ## Build the application
	$(MVNW) package

test: ## Run automated tests
	$(MVNW) test

check: test ## Run the local validation suite

clean: ## Remove Maven build artifacts
	$(MVNW) clean
