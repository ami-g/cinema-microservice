#!/usr/bin/env bash

docker service create --name cinema-catalog-service -l=apiRoute='/cinemas' -p 3001:3000 --env-file env lucaalexandru/cinema-catalog-service
