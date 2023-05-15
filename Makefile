DOCKER = docker
VUE_SRC = $(shell find public src)
WEBOS_SRC = $(shell find app)
DIST = $(shell find dist)


dist:
	mkdir dist


.PHONY: dist/index.html
dist/index.html:
	$(MAKE) -C web build


build: dist/index.html


image: build
	${DOCKER} build -t web:latest -f docker/web/Dockerfile .


.PHONY: dev
dev:
	$(MAKE) -C web dev


.PHONY: clean
clean:
	rm -rf dist
	$(MAKE) -C web clean
