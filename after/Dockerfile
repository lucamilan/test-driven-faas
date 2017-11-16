FROM node:6.10.0

COPY . /app

WORKDIR /app

RUN npm install -g serverless && \
    npm install

EXPOSE 3001

ENTRYPOINT ["serverless"]
CMD ["offline", "--stage", "dkr", "--port", "3001", "--host", "0.0.0.0"]
