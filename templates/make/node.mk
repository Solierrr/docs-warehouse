# Compose after base.mk. Requires npm and a package.json at repository root.
NPM ?= npm

.PHONY: setup dev build test lint check clean

setup: ## Install Node dependencies from the lockfile when available
	@if test -f package-lock.json; then $(NPM) ci; else $(NPM) install; fi

dev: ## Start the local development server
	$(NPM) run dev

build: ## Build the application
	$(NPM) run build

test: ## Run automated tests
	$(NPM) run test

lint: ## Run static analysis
	$(NPM) run lint

check: test lint ## Run the local validation suite

clean: ## Remove generated Node artifacts
	@echo "No generic clean target: configure generated directories per repository."
