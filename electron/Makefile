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

.PHONY: publish-linux
publish-linux:
	npm run electron:publish:AppImage

.PHONY: publish-win
publish-win:
	npm run electron:publish:nsis

.PHONY: publish
publish: publish-linux publish-win

.PHONY: clean
clean:
	rm -rf dist

