#!/bin/sh

NETWORK_NAME="whale"
SLSOFFLINE_IMAGE_NAME="slsoffline"
DYNAMODB_CONTAINER_NAME="dynamodblocal-1"
SLSOFFLINE_CONTAINER_NAME="slsoffline-1"

a=$(docker container ls -aq -f name=$DYNAMODB_CONTAINER_NAME)
if [ "$a" != "" ]; then
  docker container stop $a
  docker container rm -v $a
fi

b=$(docker ps -aq -f name=$SLSOFFLINE_CONTAINER_NAME)
if [ "$b" != "" ]; then
  docker container stop $b
  docker container rm -v $b
fi
if [ "$(docker images -q $SLSOFFLINE_IMAGE_NAME 2>/dev/null)" != "" ]; then
  docker image rm $SLSOFFLINE_IMAGE_NAME .
fi
docker image build -t $SLSOFFLINE_IMAGE_NAME .

if [ "$(docker network ls -qf name=$NETWORK_NAME 2>/dev/null)" != "" ]; then
  docker network rm $NETWORK_NAME
fi
docker network create $NETWORK_NAME

docker container run --network $NETWORK_NAME --name $DYNAMODB_CONTAINER_NAME -d -p 8000:8000 cnadiminti/dynamodb-local -sharedDb –inMemory

docker container run --network $NETWORK_NAME --name $SLSOFFLINE_CONTAINER_NAME -d -p 3001:3001 $SLSOFFLINE_IMAGE_NAME

docker exec -ti $SLSOFFLINE_CONTAINER_NAME bash -c 'serverless dynamodb migrate --stage dkr'
