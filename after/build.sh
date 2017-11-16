#!/bin/sh

NETWORK_NAME="whale"
SLSOFFLINE_IMAGE_NAME="slsoffline"
DYNAMODB_CONTAINER_NAME="dynamodblocal-1"
SLSOFFLINE_CONTAINER_NAME="slsoffline-1"
REBUILD=0
REMOVE=0

function printUsage {
  echo "Usage:  ./build.sh [OPTIONS]

  Run docker scripts

    Options:
      rebuild           Remove and build all stuff from scratch
      run               Run all containers
      remove            Remove all stuff"
}

case $1 in
  rebuild)
    REBUILD=1
    ;;
  remove)
    REMOVE=1
    ;;
  run)
    ;;
  -h | --help )
    printUsage
    exit
    ;;
  *)
    echo "command $1 is not recognized as a valid command"
    printUsage
    exit 1
esac

function stopAndRemoveContainer {
  a=$(docker container ls -aq -f name=$1)

  if [ "$a" != "" ]; then
    echo "stopping container $a..."
    docker container stop $a
    echo "removing container $a..."
    docker container rm -v $a
  fi
}

function removeImage {
  if [ "$(docker images -q $1 2>/dev/null)" != "" ]; then
    echo "removing image $1..."
    docker image rm $1 .
  fi
}

function buildImage {
  if [ "$(docker images -q $1 2>/dev/null)" == "" ]; then
    echo "building image $1..."
    docker image build -t $1 .
  fi
}

function removeNetwork {
  if [ "$(docker network ls -qf name=$1 2>/dev/null)" != "" ]; then
    echo "removing network $1..."
    docker network rm $1
  fi
}

function createNetwork {
  if [ "$(docker network ls -qf name=$1 2>/dev/null)" == "" ]; then
    echo "creating network $1..."
    docker network create $1
  fi
}

stopAndRemoveContainer $DYNAMODB_CONTAINER_NAME
stopAndRemoveContainer $SLSOFFLINE_CONTAINER_NAME

if [ $REBUILD -eq 1 ] || [ $REMOVE -eq 1 ]; then
  removeImage $SLSOFFLINE_IMAGE_NAME
fi

if [ $REMOVE -ne 1 ]; then
  buildImage $SLSOFFLINE_IMAGE_NAME
fi

if [ $REBUILD -eq 1 ] || [ $REMOVE -eq 1 ]; then
  removeNetwork $NETWORK_NAME
fi

if [ $REMOVE -ne 1 ]; then
  createNetwork $NETWORK_NAME
fi

if [ $REMOVE -ne 1 ]; then
  echo "running contaner $DYNAMODB_CONTAINER_NAME..."
  docker container run --network $NETWORK_NAME \
                       --name $DYNAMODB_CONTAINER_NAME \
                       -d \
                       -p 8000:8000 \
                       cnadiminti/dynamodb-local -sharedDb –inMemory

  echo "running npm install..."
  npm install

  echo "running contaner $SLSOFFLINE_CONTAINER_NAME..."
  docker container run --network $NETWORK_NAME \
                       --name $SLSOFFLINE_CONTAINER_NAME \
                       -d \
                       -p 3001:3001 \
                       --mount type=bind,source=$(pwd),target=/app \
                       $SLSOFFLINE_IMAGE_NAME

  echo "running dynamodb migration script..."
  docker exec -ti $SLSOFFLINE_CONTAINER_NAME \
              bash -c 'serverless dynamodb migrate --stage dkr'
fi
