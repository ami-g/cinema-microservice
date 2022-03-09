#!/usr/bin/env bash

docker service create --name booking-service -l=apiRoute='/booking' -p 3002:3000 --env-file env lucaalexandru/booking-service
