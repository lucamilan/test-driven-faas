#!/bin/sh

UNIT=0
INTEGRATION=0
DOCKER=0
STAGE="dev"

function printUsage {
  echo "Usage:  ./run_tests.sh COMMAND

  Run tests

    Commands:
      unit                   Run unit tests
      integration            Run integration tests
      docker                 Run integration tests using docker"
}

function printIntegrationUsage {
  echo "Usage:  ./run_tests.sh integration [OPTIONS]

  Run integration tests

    Options:
      --stage string         The environemnt tests will run against (default 'dev')"
}

case $1 in
  unit)
    UNIT=1
    ;;
  integration)
    INTEGRATION=1
    case $2 in
      -s | --stage)
        if [ -n "$3" ]; then
          STAGE=$3
        else
          echo "a stage needs to be provided"
          printIntegrationUsage
          exit
        fi
        ;;
      -h | --help )
        printIntegrationUsage
        exit
        ;;
      *)
        echo "unknown flag $2"
        printIntegrationUsage
        exit 1
    esac
    ;;
  docker)
    DOCKER=1
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

function runIntegrationTests {
  npm install
  node_modules/.bin/sls deploy --stage $STAGE
  node_modules/.bin/mocha tests/integration.test.js --stage $STAGE
  node_modules/.bin/sls remove --stage $STAGE
}

function runDockerTests {
  ./build.sh rebuild
  node_modules/.bin/mocha tests/integration.test.js --stage dkr --endpoint http://localhost:3001
}

function runUnitTests {
  npm install
  node_modules/.bin/mocha tests/unit.test.js
}

if [ $INTEGRATION -eq 1 ]; then
  echo "running integration tests on stage $STAGE..."
  runIntegrationTests
fi

if [ $UNIT -eq 1 ]; then
  echo "running unit tests..."
  runUnitTests
fi

if [ $DOCKER -eq 1 ]; then
  echo "running integration tests against docker..."
  runDockerTests
fi
