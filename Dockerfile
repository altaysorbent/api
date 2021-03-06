FROM node:lts-alpine3.12
WORKDIR /app
COPY . .
RUN rm -f .env
RUN yarn install
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start:prod" ]

