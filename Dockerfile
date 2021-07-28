FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json /app/

ENV NODE_ENV development
RUN npm ci

COPY .babelrc webpack.config.js /app/
COPY public /app/public
COPY src/frontend /app/src/frontend
RUN npm run build -- --mode production

FROM node:14-alpine

WORKDIR /app

COPY package*.json /app/

ENV NODE_ENV production
RUN npm ci

COPY --from=build /app/public /app/public
COPY src/api /app/src/api

CMD ["npm", "start"]
