# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
KUSTOMIZE_DIRS ?= .
INSTALL_CMD   ?=
DEV_CMD       ?=
BUILD_CMD     ?= for dir in $(KUSTOMIZE_DIRS); do kubectl kustomize $$dir > /dev/null || exit 1; done
TEST_CMD      ?=
LINT_CMD      ?= for dir in $(KUSTOMIZE_DIRS); do kubectl kustomize $$dir | kubeconform -ignore-missing-schemas -summary || exit 1; done
FORMAT_CMD    ?=
CLEAN_PATHS   ?=
DOCTOR_TOOLS  ?= git kubectl kubeconform
