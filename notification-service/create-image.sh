#!/usr/bin/env bash

docker rm -f notification-service

docker rmi notification-service

docker image prune

docker volume prune

docker build -t notification-service .

docker tag notification-service:latest lucaalexandru/notification-service:latest

docker push lucaalexandru/notification-service:latest
