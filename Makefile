DOCKER = docker
DOCKER_COMPOSE = docker compose -p cesium-watch
DOCKER_TAG ?= :latest

ANDROID_HOME=${HOME}/Android

ifeq ($(MAKECMDGOALS),build-android)
include .android-build.mk
endif

/usr/bin/rpm:
	sudo apt install -y rpm

/usr/bin/flatpak:
	sudo apt install -y flatpak

/usr/bin/flatpak-builder:
	sudo apt install -y flatpak-builder

deps: /usr/bin/rpm /usr/bin/flatpak /usr/bin/flatpak-builder

# Build web app
.PHONY: build
build:
	npm run build

# Copy web assets to android/
.PHONY: copy-android
copy-android: build
	npx cap sync android

# Copy web assets to electron/
.PHONY: copy-electron
copy-electron: build
	npx cap sync @capacitor-community/electron

.PHONY: run-android
run-android: copy-android
	ANDROID_SDK_ROOT=${ANDROID_HOME}/Sdk npx cap run android

.PHONY: build-webos
build-webos:
	${MAKE} -C webos build

.PHONY: build-android
build-android: copy-android
# Build
	ANDROID_HOME='${ANDROID_HOME}' npx cap build android --keystorepath='${STORE_PATH}' --keystorepass='${STORE_PASS}' --keystorealias='${ALIAS_NAME}' --keystorealiaspass=${ALIAS_PASS}

.PHONY: build-electron
build-electron: copy-electron
	${MAKE} -C electron build

.PHONY: build-docker
build-docker: build
	${DOCKER} build . -f docker/watch/Dockerfile -t cesium-watch${DOCKER_TAG}

.PHONY: run-electron
run-electron: build-electron
	npx cap open @capacitor-community/electron

.PHONY: package-electron
package-electron: build-electron
	${MAKE} -C electron package

.PHONY: package-electron-linux
package-electron-linux: build-electron
	${MAKE} -C electron package-linux

.PHONY: package-electron-win
package-electron-win: build-electron
	${MAKE} -C electron package-win

.PHONY: publish-electron
publish-electron: build-electron
	${MAKE} -C electron publish

.PHONY: publish-electron-linux
publish-electron-linux: build-electron
	${MAKE} -C electron publish-linux

.PHONY: publish-electron-win
publish-electron-win: build-electron
	${MAKE} -C electron publish-win

run:
	npm run dev

clean:
	rm -rf dest/ installers/
	${MAKE} -C electron clean
	${MAKE} -C webos clean

assets:
	npx @capacitor/assets generate --iconBackgroundColor #9bb3d5 --iconBackgroundColorDark #252a33 --splashBackgroundColor #9bb3d5 --splashBackgroundColorDark #252a33
