# Python Collab

Web service for teaching Python 3 programming language

## Deployment

Application is ready-to-run in Docker container:

1. Set convenient port-forwarding and other configuration
in [docker-compose.yml](https://github.com/somnoynadno/python-collab/blob/master/docker-compose.yml)

2. Set **your own** IP address (or domain name) in 
frontend [configuration file](https://github.com/somnoynadno/python-collab/blob/master/frontend/.env)

3. Build and start containers with ` $ docker-compose up --build -d` command

NOTE: backend is not well-tested and might not be ready for a high-load (also it has a memory leak).

## Copyright

This source code is distributed under the [MIT License](https://github.com/somnoynadno/python-collab/blob/master/LICENSE).
