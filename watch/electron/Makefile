.PHONY: buid
build:
	npm run build

.PHONY: package-linux
package-linux:
	npm run electron:pack:AppImage

.PHONY: package-win
package-win:
	npm run electron:pack:nsis

.PHONY: package
package: package-linux package-win
