#!/usr/bin/env bash


docker build -t regexzone .

docker run -it -p 3000:3000 regexzone
