#!/usr/bin/env bash

docker service create --name notification-service -l=apiRoute='/notification' -p 3004:3000 --env-file env --env-file env lucaalexandru/notification-service
