FROM node:14.15.4-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:14.15.4-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}}

WORKDIR /urs/src/app

COPY package*.json ./

RUN npm install --only=production
EXPOSE 3000

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]