# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
SH_FILES      ?= $(wildcard *.sh)
INSTALL_CMD   ?=
DEV_CMD       ?=
BUILD_CMD     ?= for f in $(SH_FILES); do bash -n $$f || exit 1; done
TEST_CMD      ?=
LINT_CMD      ?= shellcheck $(SH_FILES)
FORMAT_CMD    ?=
CLEAN_PATHS   ?=
DOCTOR_TOOLS  ?= git bash shellcheck
