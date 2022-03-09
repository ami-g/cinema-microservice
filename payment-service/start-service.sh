#!/usr/bin/env bash

docker service create --name payment-service -l=apiRoute='/payment' -p 3003:3000 --env-file env lucaalexandru/payment-service
