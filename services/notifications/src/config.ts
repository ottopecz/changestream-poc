export default Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  logging: {
    level: process.env.LOGGING_LEVEL
  },
  mongo: {
    hosts: process.env.MONGO_HOSTS,
    database: process.env.MONGO_DATABASE,
    collection: process.env.MONGO_COLLECTION,
    isSRVConnection: process.env.MONGO_IS_SRV_CONNECTION,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    options: process.env.MONGO_OPTIONS
  }
})
