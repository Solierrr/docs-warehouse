# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
INSTALL_CMD   ?= ./gradlew dependencies
DEV_CMD       ?=
BUILD_CMD     ?= ./gradlew assembleDebug
TEST_CMD      ?= ./gradlew testDebugUnitTest
LINT_CMD      ?= ktlint "app/src/**/*.kt" && ./gradlew lintDebug
FORMAT_CMD    ?= ktlint -F "app/src/**/*.kt"
OPENAPI_CMD   ?=
CLEAN_PATHS   ?= build app/build .gradle
DOCTOR_TOOLS  ?= git java adb ktlint
