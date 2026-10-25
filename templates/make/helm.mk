# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
CHART_DIR     ?= .
INSTALL_CMD   ?= helm dependency update $(CHART_DIR)
DEV_CMD       ?=
BUILD_CMD     ?= helm template $(CHART_DIR) > /dev/null
TEST_CMD      ?=
LINT_CMD      ?= helm lint $(CHART_DIR)
FORMAT_CMD    ?=
OPENAPI_CMD   ?=
CLEAN_PATHS   ?=
DOCTOR_TOOLS  ?= git helm
