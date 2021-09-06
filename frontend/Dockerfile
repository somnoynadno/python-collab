# Stage 1 - the build process
FROM node:14.15.0-alpine3.12 as builder
MAINTAINER "Alexander Zorkin"

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install --production

COPY . ./
RUN npm run build

# Stage 2 - release
FROM node:14.15.0-alpine3.12 as release

WORKDIR /app
COPY --from=builder /app/build ./build

RUN npm -g install serve

CMD ["serve", "-s", "build", "-p", "3000"]
EXPOSE 3000
