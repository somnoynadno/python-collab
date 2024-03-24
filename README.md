# Python Collab

Web service for teaching Python 3 programming language.

## Deployment

### Using Docker

Application is ready-to-run in Docker container:

1. Set convenient port-forwarding and other configuration
in [docker-compose.yml](https://github.com/somnoynadno/python-collab/blob/master/docker-compose.yml)

2. Set **your own** IP address or domain name in 
[frontend configuration file](https://github.com/somnoynadno/python-collab/blob/master/frontend/.env)

3. Build and start containers with ` $ docker-compose up --build -d` command

### Manual

To manually start web server, run following commands:

```bash
 $ cd backend
 # use go v1.22 or higher
 $ go mod tidy
 $ go build .
 # server will use port 8000 by default
 $ ./backend
```

For frontend application:

```bash
 $ cd frontend
 # use npm v8.19.0 and node v16
 $ npm i
 $ npm run start
```

## Copyright

This source code is distributed under the [MIT License](https://github.com/somnoynadno/python-collab/blob/master/LICENSE).
