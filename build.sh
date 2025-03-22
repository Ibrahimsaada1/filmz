#!/bin/bash

set -e

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t sarptom/filmz:latest \
  --push \
  .