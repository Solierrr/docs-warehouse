# Compose after base.mk (and the stack fragment). Runs the service on the local
# machine from its Docker Hub image, with secrets read from Infisical.
# Requires Docker and `infisical login`. See helps/TRY-LOCAL.md.
LOCAL_SERVICE ?= $(notdir $(CURDIR))
LOCAL_SH := $(ORG_SCRIPTS_DIR)/scripts/local.sh
SECRETS_ENV ?= qa
DB ?= remote
OBS ?= 0
BUILD ?= 0
ALL ?= 0
TAG ?=
LOCAL_ENV := SERVICE=$(LOCAL_SERVICE) ENV=$(SECRETS_ENV) DB=$(DB) OBS=$(OBS) BUILD=$(BUILD) ALL=$(ALL) $(if $(TAG),TAG=$(TAG),) $(if $(ENV_FILE),ENV_FILE=$(ENV_FILE),)

.PHONY: up down logs

up: vault-config ## Run the service locally (DB=local for local databases, OBS=1 for Grafana, BUILD=1 for the local image)
	@$(LOCAL_ENV) sh $(LOCAL_SH) up

down: vault-config ## Stop the local service (ALL=1 also stops databases and Grafana)
	@$(LOCAL_ENV) sh $(LOCAL_SH) down

logs: vault-config ## Follow the local service logs
	@$(LOCAL_ENV) sh $(LOCAL_SH) logs

ifneq ($(wildcard Dockerfile),)
.PHONY: docker-build docker-push

docker-build: vault-config ## Build the local image from the Dockerfile
	@$(LOCAL_ENV) sh $(LOCAL_SH) docker-build

docker-push: vault-config ## Push a development image (TAG=dev-name; never latest or a release tag)
	@$(LOCAL_ENV) sh $(LOCAL_SH) docker-push
endif

ifneq ($(wildcard compose.yaml compose.yml docker-compose.yaml docker-compose.yml),)
.PHONY: compose

compose: vault-config ## Run the repository's own compose file
	@$(LOCAL_ENV) sh $(LOCAL_SH) compose
endif
