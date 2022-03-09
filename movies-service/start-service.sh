#!/usr/bin/env bash

docker service create --name movies-service -l=apiRoute='/movies' -p 3000:3000 --env-file env lucaalexandru/movies-service
