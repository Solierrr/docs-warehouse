# ---- especifico deste repositorio ----
VAULT_FOLDERS ?= /database
INSTALL_CMD   ?= python -m pip install -r scripts/requirements.txt
DEV_CMD       ?=
BUILD_CMD     ?= python -m compileall -q scripts
TEST_CMD      ?= python -m pytest tests
LINT_CMD      ?= python -m ruff check scripts tests
FORMAT_CMD    ?=
OPENAPI_CMD   ?=
CLEAN_PATHS   ?= .pytest_cache .ruff_cache
DOCTOR_TOOLS  ?= git python psql
