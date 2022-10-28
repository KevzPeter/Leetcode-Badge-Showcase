# STAGE 1

FROM node:18-alpine as builder

WORKDIR /leetcode-badge-showcase

COPY ./package.json .

RUN npm i

COPY . .

RUN npm run build

# STAGE 2

FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /leetcode-badge-showcase/out /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

# The sole purpose of using nginx was to reduce image size, from an initial 1.5Gb to now 24Mb
# However, nginx throws 404 error on api routes. Need to fix this issue in future.