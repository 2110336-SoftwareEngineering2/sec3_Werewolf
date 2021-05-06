FROM node:lts-alpine3.10 AS build-deps
WORKDIR /usr/src/app
COPY package*.json ./
ENV PATH ./node_modules/.bin:$PATH
RUN npm install --silent
COPY . ./
RUN npm run build

FROM nginx:1.19.10-alpine
COPY --from=build-deps /usr/src/app/build /usr/share/nginx/html
# COPY --from=build-deps /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]