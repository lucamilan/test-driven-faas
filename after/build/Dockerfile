FROM node

RUN npm install -g serverless
RUN npm install serverless-offline -g
RUN npm install serverless-dynamodb-local -g

COPY . /app/
WORKDIR /app

EXPOSE 3000
EXPOSE 8000

