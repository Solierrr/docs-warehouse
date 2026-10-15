# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
INSTALL_CMD   ?= npm ci
DEV_CMD       ?= npm run dev
BUILD_CMD     ?= npm run build
TEST_CMD      ?= npm test
LINT_CMD      ?= npm run lint
FORMAT_CMD    ?= npm run format
CLEAN_PATHS   ?= dist
DOCTOR_TOOLS  ?= git node npm
