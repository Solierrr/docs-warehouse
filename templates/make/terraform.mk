# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
INSTALL_CMD   ?= terraform init -backend=false
DEV_CMD       ?=
BUILD_CMD     ?= terraform validate
TEST_CMD      ?=
LINT_CMD      ?= terraform fmt -check -recursive
FORMAT_CMD    ?= terraform fmt -recursive
CLEAN_PATHS   ?= .terraform
DOCTOR_TOOLS  ?= git terraform
