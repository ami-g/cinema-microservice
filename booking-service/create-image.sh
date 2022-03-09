#!/usr/bin/env bash

docker rm -f booking-service

docker rmi booking-service

docker image prune

docker volume prune

docker build -t booking-service .

docker tag booking-service:latest lucaalexandru/booking-service:latest

docker push lucaalexandru/booking-service:latest
