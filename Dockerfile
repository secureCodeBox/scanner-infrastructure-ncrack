FROM ubuntu:18.04

RUN apt-get update

# Ncrack
RUN apt-get install -y wget build-essential libssl-dev libz-dev
RUN wget https://nmap.org/ncrack/dist/ncrack-0.7.tar.gz && \
    tar -xzf ncrack-0.7.tar.gz && \
    cd ncrack-0.7 && \
    ./configure && \ 
    make && \
    make install
RUN ncrack --version

# Node.js
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN node -v
RUN npm -v

COPY package.json package-lock.json /src/
WORKDIR /src
RUN npm install --production
COPY ./ /src
    
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

ENTRYPOINT [ "node", "/src/index.js" ]