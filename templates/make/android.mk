# Compose after base.mk. Requires Android SDK command-line tools and Gradle wrapper.
GRADLEW ?= ./gradlew
ADB ?= adb
KTLINT ?= ktlint
APP_ID ?= change-me
MAIN_ACTIVITY ?= $(APP_ID)/.MainActivity
DEBUG_APK ?= app/build/outputs/apk/debug/app-debug.apk
ADB_DEVICE := $(if $(DEVICE),-s $(DEVICE),)

.PHONY: doctor build install run launch devices test lint android-lint check clean

doctor: ## Check JDK and Android platform tools
	@command -v java >/dev/null 2>&1 || { echo "error: Java was not found"; exit 1; }
	@command -v $(ADB) >/dev/null 2>&1 || { echo "error: adb was not found"; exit 1; }

build: ## Build the debug APK
	$(GRADLEW) assembleDebug

install: build ## Install the debug APK on a connected device
	$(ADB) $(ADB_DEVICE) install -r $(DEBUG_APK)

run: install ## Install and open the application
	$(ADB) $(ADB_DEVICE) shell am start -n $(MAIN_ACTIVITY)

launch: ## Open an installed application
	$(ADB) $(ADB_DEVICE) shell am start -n $(MAIN_ACTIVITY)

devices: ## List connected Android devices
	$(ADB) devices -l

test: ## Run debug unit tests
	$(GRADLEW) testDebugUnitTest

lint: ## Run Kotlin formatting checks
	$(KTLINT) "app/src/**/*.kt"

android-lint: ## Run Android lint for the debug variant
	$(GRADLEW) lintDebug

check: test lint android-lint ## Run the local validation suite

clean: ## Remove Gradle build artifacts
	$(GRADLEW) clean
