FROM node:12-alpine AS buildcontainer
COPY package.json package-lock.json /src/
WORKDIR /src
RUN npm install --production
COPY . /src

FROM ubuntu:18.04

RUN apt-get update
RUN apt install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt install -y nodejs libssl-dev ncrack
RUN node -v

COPY --from=buildcontainer /src /src
    
# HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 CMD node healthcheck.js || exit 1

ARG COMMIT_ID=unkown
ARG REPOSITORY_URL=unkown
ARG BRANCH=unkown
ARG BUILD_DATE
ARG VERSION

ENV SCB_COMMIT_ID ${COMMIT_ID}
ENV SCB_REPOSITORY_URL ${REPOSITORY_URL}
ENV SCB_BRANCH ${BRANCH}

LABEL org.opencontainers.image.title="secureCodeBox scanner-infrastructure-ncrack" \
    org.opencontainers.image.description="Ncrack integration for secureCodeBox" \
    org.opencontainers.image.authors="iteratec GmbH" \
    org.opencontainers.image.vendor="iteratec GmbH" \
    org.opencontainers.image.documentation="https://github.com/secureCodeBox/secureCodeBox" \
    org.opencontainers.image.licenses="Apache-2.0" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.url=$REPOSITORY_URL \
    org.opencontainers.image.source=$REPOSITORY_URL \
    org.opencontainers.image.revision=$COMMIT_ID \
    org.opencontainers.image.created=$BUILD_DATE

RUN ncrack --help

ENTRYPOINT [ "node", "/src/index.js" ]