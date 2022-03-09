#!/usr/bin/env bash

echo 'updating git submodules'
git submodule update --init --recursive
echo 'update submodules done'

cd ./api-gateway/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -
cd ./booking-service/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -
cd ./cinema-catalog-service/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -
cd ./movies-service/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -
cd ./notification-service/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -
cd ./payment-service/src/specula-auto-tracer && git stash && git checkout develop && git pull && npm i && cd -

echo 'init done'