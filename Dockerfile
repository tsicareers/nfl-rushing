FROM node:15

# working directory for app inside the image
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# bundle app
COPY . /usr/src/app

EXPOSE 5001
CMD [ "node", "server.js" ]