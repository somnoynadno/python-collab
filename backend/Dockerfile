FROM golang:latest
LABEL maintainer="Alexander Zorkin"

RUN mkdir /app
ADD . /app/
WORKDIR /app

RUN go build -o main .
CMD ["/app/main"]

EXPOSE 8000