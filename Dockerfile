FROM node:6.10.0

WORKDIR /app

EXPOSE 3001

ENTRYPOINT ["/app/node_modules/.bin/sls"]
CMD ["offline", "--stage", "dkr", "--port", "3001", "--host", "0.0.0.0"]
