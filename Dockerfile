FROM node:lts-alpine3.19
WORKDIR /app
COPY . .
RUN rm -f .env
RUN npm ci
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

