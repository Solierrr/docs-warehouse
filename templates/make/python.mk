# Compose after base.mk. Override APP_MODULE for FastAPI/Uvicorn applications.
PYTHON ?= python
VENV ?= .venv
VENV_BIN ?= $(VENV)/Scripts
APP_MODULE ?= app.main:app
HOST ?= 127.0.0.1
PORT ?= 8000

.PHONY: setup run test lint check clean

setup: ## Create the virtualenv and install project dependencies
	$(PYTHON) -m venv $(VENV)
	$(VENV_BIN)/python -m pip install --upgrade pip
	@if test -f requirements.txt; then $(VENV_BIN)/python -m pip install -r requirements.txt; fi
	@if test -f requirements-dev.txt; then $(VENV_BIN)/python -m pip install -r requirements-dev.txt; fi

run: ## Run the Uvicorn application (APP_MODULE=package.module:app)
	$(VENV_BIN)/python -m uvicorn $(APP_MODULE) --host $(HOST) --port $(PORT) --reload

test: ## Run Python tests
	$(VENV_BIN)/python -m pytest

lint: ## Run Ruff static analysis
	$(VENV_BIN)/python -m ruff check .

check: test lint ## Run the local validation suite

clean: ## Remove Python caches
	@echo "Remove .venv and cache directories manually when required."
