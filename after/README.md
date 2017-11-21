# GraphQL Offline

Test your service locally, without having to deploy it first.

## Deploy

```bat
npm install
node_modules/.bin/sls deploy
node_modules/.bin/sls deploy function -f graphql
```

## Quick Smoke Test

```bash
# via sls invoke
node_modules/.bin/sls invoke -f graphql --data '{ "queryStringParameters" : { "query" : "{value(key:\"Username\")}"  }  }'
node_modules/.bin/sls invoke -f graphql --data '{ "queryStringParameters" : { "query" : "mutation {value(key:\"Username\", value: \"Luca\")}"  }  }'
```

## Serverless Plugins

 - [serverless-offline](https://github.com/dherault/serverless-offline)
 - [serverless-dynamodb-local](https://github.com/99xt/serverless-dynamodb-local)

## Docker

Run `./build.sh rebuild` to build docker images and running all required containers.
For further details, run `./build.sh --help`.

## Testing

### Unit Tests

Run `./run_tests.sh unit`.

### Integration Tests

Run `./run_tests.sh integration --stage testingstage`.

### Integration Tests against Docker

Run `./run_tests.sh docker`.

