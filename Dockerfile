FROM node:17-alpine3.14
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY . ./
CMD [ "node", "server.js" ]