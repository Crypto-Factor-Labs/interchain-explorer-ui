FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY angular.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY ./deploy-cfg/entrypoint.dev.sh /entrypoint.sh

RUN npm ci --include=dev

EXPOSE 4200

CMD sh /entrypoint.sh
