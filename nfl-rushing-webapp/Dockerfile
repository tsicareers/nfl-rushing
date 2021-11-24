FROM node:lts

RUN yarn install

WORKDIR /app

COPY . /app

EXPOSE 8000

CMD ["yarn", "start" ]