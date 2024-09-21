#!/usr/bin/env bash
#
# 本地构建并推送项目镜像
#
# Globals:
#  DOCKER_REGISTRY_SERVER
#  TAG

set -e

cd $(dirname $0)/../..

PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')

DOCKER_REGISTRY_SERVER=${DOCKER_REGISTRY_SERVER:=registry.yourbiz.com}
IMAGE=${DOCKER_REGISTRY_SERVER}/m-fe-rtw
TAG=${PACKAGE_VERSION:=latest}

yarn build

echo "[*] Finished building"

docker build --tag $IMAGE:$TAG -f scripts/docker/Dockerfile.local ./build

echo "[*] Pushing $IMAGE:$TAG"

docker push $IMAGE:$TAG
