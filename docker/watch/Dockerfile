FROM node:19-buster-slim AS vue

ENV NODE_OPTIONS=--openssl-legacy-provider

ADD ./watch /app
ADD ./docker/watch/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
WORKDIR /app

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y git && \
    npm install -g && \
    apt-get remove -y git && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT [ "/entrypoint.sh" ]


FROM vue as vue-build

RUN npm run build

FROM nginx:stable-alpine AS prod

COPY --from=vue-build /dist/* /usr/share/nginx/html/
