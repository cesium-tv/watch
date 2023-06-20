VUE_SRC = $(shell find public src)


node_modules: package-lock.json
	npm i
	touch node_modules


dist:
	mkdir dist


dist/index.html: $(VUE_SRC)
	npm run build
	touch dist/index.html


build: node_modules dist/index.html


.PHONY: dev
dev: node_modules
	npm run dev


.PHONY: preview
preview:
	npm run preview


.PHONY: clean
clean:
	rm -rf node_modules
