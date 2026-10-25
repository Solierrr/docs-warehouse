# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
ifeq ($(OS),Windows_NT)
PY ?= .venv/Scripts/python
else
PY ?= .venv/bin/python
endif
INSTALL_CMD   ?= python -m venv .venv && $(PY) -m pip install -r requirements.txt ruff pytest
DEV_CMD       ?= $(PY) -m uvicorn main:app --reload
BUILD_CMD     ?= $(PY) -m compileall -q -x '(^|[^a-zA-Z0-9_])venv[^a-zA-Z0-9_.]' .
TEST_CMD      ?= $(PY) -m pytest
LINT_CMD      ?= $(PY) -m ruff check . && $(PY) -m ruff format --check .
FORMAT_CMD    ?= $(PY) -m ruff format .
OPENAPI_CMD   ?= $(PY) scripts/export_openapi.py
CLEAN_PATHS   ?= .venv .pytest_cache .ruff_cache .mypy_cache
DOCTOR_TOOLS  ?= git python
