FROM node:12
WORKDIR /usr/src/app
COPY ./src/package*.json ./
RUN npm install
COPY ./src .
EXPOSE 8080
EXPOSE 443
CMD [ "node", "main.js" ]
