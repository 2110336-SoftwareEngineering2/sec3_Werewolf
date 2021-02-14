FROM node:14.15.4-alpine AS base

WORKDIR /usr/src/app

FROM base AS development

COPY package*.json ./

RUN npm install --production
RUN cp -R node_modules /tmp/node_modules

RUN npm install

COPY . ./

FROM development AS builder
## skip test for now
# RUN npm run lint
# RUN npm run test:cov
# RUN npm run test:e2e
RUN npm run build

FROM base AS release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

CMD ["npm", "run", "start:prod"]
