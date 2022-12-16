# Changestream POC

This Proof of Concept project is supposed to demonstrate how [mongo changestreams]((https://www.mongodb.com/docs/manual/changeStreams/)) can work. 

## Premises
- node v18
- docker v20
- docker-compose v2

## Install
```shell
cd <path-to-root>
npm i
```

## Lint
```shell
cd <path-to-root>
npm run lint --workspaces
```

## Test
Some tests are using a database so the docker daemon needs to be running
```shell
cd <path-to-root>
npm test --workspaces
```

## Run

### sensor-data service
**It's not going to run locally as is...** The environment needs to be set. It needs a `.env` file which can be provided upon request. I provisioned a basic replicaset in MongoDB Atlas which can be used...
```shell
cd <path-to-root>
npm run start -w services/sensor-data
```

### notification service
**It's not going to run locally as is...** The environment needs to be set. It needs a `.env` file which can be provided upon request. I provisioned a basic replicaset in MongoDB Atlas which can be used...
```shell
cd <path-to-root>
npm run start -w services/sensor-data
```

## Intro
Mongo can stream out any changes from the database (inserts, updates, deletes, etc.) It's really beneficial to directly react of the changes of the state of the application. Which is stored in the database... :)

## Dataflow
1. A request is being made against the api of the **sensor-data service**
```shell
curl --location --request PUT 'http://localhost:3000/data' \
--header 'Content-Type: application/json' \
--data-raw '{
    "sensorId": "bf951e3e-aefd-4335-a330-5fcca06f100d",
    "time": 1670769952022,
    "value": 6.2
}
```
2. The **sensor-data service** stores the document.
3. An `insert` change event streams out of the `sensor-data` collection of the database. The event carries the full `sensor-data` document.
4. Based on the change event the client of the **sensor-data** service makes a request against the api of the notification service.
```shell
curl --location --request PUT 'http://localhost:3001/alerts' \
--header 'Content-Type: application/json' \
--data-raw '{
  "type": "sensor",
  "context": {
    "reading": {
      "sensorId": "a6620c91-c855-4a16-a9a2-779861f93714",
      "time": 1670682969883,
      "value": 6.2
    },
    "validRange": {
      "from": 5,
      "to": 6
    }
  }
}'
```
5. The **notification service** stores the document
6. An `insert` change event streams out of the `notifications` collection of the database. The even carries the full `notification` document.
7. Based on the change event the client of the `notification` service makes a request against the api of the **third party notification provider**.

## Project structure

### Libraries
Ideally they can be `npm` packages.

### Services

#### Server
The api part of the service accepting http requests.

#### Client
The client listens to change events coming out of the database and makes requests against other services internal or external.

## Way to improve the concept.
+ The services shouldn't "talk" to each other directly. Ideally I would want the internal event to be submitted to an internal event bus (**Kafka**, **RabbitMQ**, **AWS SQS/SNS/EventBridge**). Any other service which is interested in the event can subscribe to it. However, data carrier messages needs to keep their order. So that problem needs to be addressed...

## And sorry for...
+ Yes, I know the typing is sloppy.
+ The error handling is a bit adhoc.


