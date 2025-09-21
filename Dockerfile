FROM node:18-alpine As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:1.24

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/explorer-ui/browser/ /usr/share/nginx/html

COPY ./deploy-cfg/entrypoint.sh /entrypoint.sh

RUN sed -i "s|index  index.html index.htm;|index  index.html index.htm;\ntry_files \$uri \$uri/ /index.html;|g" /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/bin/bash", "/entrypoint.sh"]
