# Compose after base.mk. Runs a group of services and a local Kubernetes cluster
# with Argo CD. Requires Docker, `infisical login` and (for the cluster) kubectl.
# See helps/TRY-LOCAL.md.
LOCAL_SH ?= $(ORG_SCRIPTS_DIR)/scripts/local.sh
CLUSTER_SH ?= $(ORG_SCRIPTS_DIR)/scripts/cluster.sh
SECRETS_ENV ?= qa
PROFILE ?= core
DB ?= remote
OBS ?= 0
ALL ?= 0
APPS ?=
SERVICES ?=

.PHONY: up-stack down-stack cluster-up cluster-down cluster-status cluster-apps cluster-secrets cluster-password cluster-ui

up-stack: vault-config ## Run a group of services locally (PROFILE=core|rec|ai|all; DB=local, OBS=1)
	@PROFILE=$(PROFILE) ENV=$(SECRETS_ENV) DB=$(DB) OBS=$(OBS) sh $(LOCAL_SH) stack

down-stack: vault-config ## Stop the group of services (ALL=1 also stops databases and Grafana)
	@PROFILE=$(PROFILE) ALL=$(ALL) sh $(LOCAL_SH) unstack

cluster-up: vault-config ## Create the local k3d cluster and install Argo CD
	@sh $(CLUSTER_SH) up

cluster-down: vault-config ## Delete the local cluster
	@sh $(CLUSTER_SH) down

cluster-status: vault-config ## Show the Argo CD applications of the local cluster
	@sh $(CLUSTER_SH) status

cluster-apps: vault-config ## Apply Argo CD applications from infra-gitops (APPS="api-core api-auth" or APPS=root)
	@sh $(CLUSTER_SH) apps $(APPS)

cluster-secrets: vault-config ## Create the <service>-secrets from Infisical in the local cluster (SERVICES="api-core")
	@ENV=$(SECRETS_ENV) sh $(CLUSTER_SH) secrets $(SERVICES)

cluster-password: vault-config ## Print the Argo CD admin password
	@sh $(CLUSTER_SH) password

cluster-ui: vault-config ## Open the Argo CD UI on https://localhost:8085
	@sh $(CLUSTER_SH) ui
