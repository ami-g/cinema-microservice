#!/usr/bin/env bash

docker rm -f api-gateway-service

docker rmi api-gateway-service

docker image prune

docker volume prune

docker build -t api-gateway-service .

docker tag api-gateway-service:latest lucaalexandru/api-gateway-service:latest

docker push lucaalexandru/api-gateway-service:latest