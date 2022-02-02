FROM node:17-alpine
WORKDIR /app
COPY package.json .
#RUN npm install
RUN npm install --only=production
COPY . ./
#CMD [ "npm","run","dev" ]
CMD [ "npm","run", "prod" ]
