DOCKER = docker
DOCKER_COMPOSE = docker compose -p cesium-watch


dist:
	$(MAKE) -C watch build


.PHONY: build
build:
	${DOCKER_COMPOSE} build


.PHONY: run
run:
	${DOCKER_COMPOSE} up


.PHONY: stop
stop:
	${DOCKER_COMPOSE} stop


image:
	${DOCKER} build . -f docker/watch/Dockerfile --target=prod -t cesium-watch


.PHONY: run
run:
	${DOCKER_COMPOSE} up


.PHONY: dev
dev:
	$(MAKE) -C watch dev


.PHONY: clean
clean:
	rm -rf dist
	$(MAKE) -C watch clean
	${DOCKER_COMPOSE} rm --force
