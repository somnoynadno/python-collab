# Stage 1 - the build process
FROM node:16 as builder

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

COPY . ./
RUN npm run build

# Stage 2 - release
FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*
COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
