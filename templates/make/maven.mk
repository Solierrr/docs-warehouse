# ---- especifico deste repositorio ----
VAULT_FOLDERS ?=
INSTALL_CMD   ?= ./mvnw dependency:go-offline
DEV_CMD       ?= ./mvnw spring-boot:run
BUILD_CMD     ?= ./mvnw package -DskipTests
TEST_CMD      ?= ./mvnw test
LINT_CMD      ?= ./mvnw org.apache.maven.plugins:maven-checkstyle-plugin:3.6.0:check -Dcheckstyle.config.location=google_checks.xml -Dcheckstyle.violationSeverity=error -B
FORMAT_CMD    ?=
CLEAN_PATHS   ?= target
DOCTOR_TOOLS  ?= git java
