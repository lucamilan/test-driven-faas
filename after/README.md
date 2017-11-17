# GraphQL Offline

Test your service locally, without having to deploy it first.

## Setup

```bat
npm install
serverless dynamodb install
serverless offline start
serverless dynamodb migrate
```

# Test

```bat
# via sls invoke
sls invoke -f graphql --data '{ "queryStringParameters" : { "query" : "{value(key:\"Username\")}"  }  }'
sls invoke -f graphql --data '{ "queryStringParameters" : { "query" : "mutation {value(key:\"Username\", value: \"Luca\")}"  }  }'
```

```bat
#via curl
curl -G 'http://localhost:3001/graphql' --data-urlencode 'query={value(key:"Username")}'

curl -G 'http://localhost:3001/graphql' --data-urlencode 'query=mutation {value(key:"Username", value: "Luca")}'
```

```bat
sls deploy
sls deploy function -f graphql
```

# How is changed

Now, we can connect to local endpoint of DynamoDb

```javascript
let options = {}

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  }
}

const db = new AWS.DynamoDB.DocumentClient(options)
```

Because { Ref: XYZ } CF syntax is not supported

```yml
DB_TABLE: ${self:custom.dbTable}
```

Shell for local endpoint http://localhost:8000/shell

```javascript
var params = {
    TableName: 'graphql-dev',
    Limit: 10
    }
dynamodb.scan(params, function(err, data) {
    if (err) ppJson(err)
    else ppJson(data)
});
```

## Docker

```bat
docker build -t serverless .
docker run -p 49160:8080 -d serverless
docker images
docker ps -a
docker rm $(docker ps -aq) 
```


