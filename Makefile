DOCKER = docker


build:
	$(MAKE) -C watch build


image: build
	${DOCKER} build -t watch:latest -f docker/watch/Dockerfile .


.PHONY: dev
dev:
	$(MAKE) -C watch dev


.PHONY: clean
clean:
	rm -rf dist
	$(MAKE) -C watch clean
