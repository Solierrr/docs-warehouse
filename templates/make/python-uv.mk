# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
INSTALL_CMD   ?= uv sync --frozen --extra dev
DEV_CMD       ?=
BUILD_CMD     ?= uv build
TEST_CMD      ?= uv run pytest
LINT_CMD      ?= uv run ruff check . && uv run ruff format --check .
FORMAT_CMD    ?= uv run ruff format .
CLEAN_PATHS   ?= .venv dist .pytest_cache .ruff_cache
DOCTOR_TOOLS  ?= git python uv
