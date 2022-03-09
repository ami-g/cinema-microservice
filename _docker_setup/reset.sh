#!/usr/bin/env bash

eval `docker-machine env manager1`

docker service rm api-gateway-service movies-service notification-service cinema-catalog-service payment-service booking-service

for server in manager1 worker1 worker2
do
  eval `docker-machine env $server`

  for image in lucaalexandru/api-gateway-service lucaalexandru/movies-service lucaalexandru/cinema-catalog-service lucaalexandru/booking-service lucaalexandru/payment-service lucaalexandru/notification-service
    do
      IMAGE=$(docker images $image -q)
      docker rmi -f $IMAGE
  done
done
