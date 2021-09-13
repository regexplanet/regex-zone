#!/usr/bin/env bash
#
# run via Dockerfile
#

set -o errexit
set -o pipefail
set -o nounset


docker build -t regexzone .

docker run -it -p 3000:3000 regexzone
