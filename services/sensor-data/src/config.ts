export const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  logging: {
    level: process.env.LOGGING_LEVEL
  },
  mongo: {
    hosts: process.env.MONGO_HOSTS,
    database: process.env.MONGO_DATABASE,
    isSRVConnection: process.env.MONGO_IS_SRV_CONNECTION,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    options: process.env.MONGO_OPTIONS
  },
  sensorData: {
    resourceName: process.env.MONGO_RESOURCE_NAME
  }
})

export function configProvider ({
  nodeEnv,
  port,
  logging,
  mongo,
  sensorData
}: {
  nodeEnv: unknown
  port: unknown
  logging: { level: unknown }
  mongo: {
    hosts: unknown
    database: unknown
    isSRVConnection: unknown
    username: unknown
    password: unknown
    options: unknown
  }
  sensorData: { resourceName: unknown }
}): {
    nodeEnv: string
    port: number
    logging: { level: string }
    mongo: {
      hosts: string
      database: string
      isSRVConnection?: boolean
      username?: string
      password?: string
      options?: { [p: string ]: unknown }
    }
    sensorData: { resourceName: string }
  } {
  if (typeof nodeEnv !== 'string') {
    throw new TypeError('The type of nodeEnv has to be a string')
  }

  if (typeof port !== 'string') {
    throw new TypeError('The type of port has to be a string')
  }

  if (typeof logging.level !== 'string') {
    throw new TypeError('The type of logging.level has to be a string')
  }

  if (typeof mongo.hosts !== 'string') {
    throw new TypeError('The type of mongo.hosts has to be a string')
  }

  if (typeof mongo.database !== 'string') {
    throw new TypeError('The type of mongo.database has to be a string')
  }

  if (mongo.isSRVConnection !== undefined && typeof mongo.isSRVConnection !== 'string') {
    throw new TypeError('The type of mongo.isSRVConnection has to be a string')
  }

  if (mongo.username !== undefined && typeof mongo.username !== 'string') {
    throw new TypeError('The type of mongo.username has to be a string')
  }

  if (mongo.password !== undefined && typeof mongo.password !== 'string') {
    throw new TypeError('The type of mongo.password has to be a string')
  }

  if (mongo.options !== undefined && typeof mongo.options !== 'string') {
    throw new TypeError('The type of mongo.options has to be a string')
  }

  const mongoRes: {
    hosts: string
    database: string
    isSRVConnection?: boolean
    username?: string
    password?: string
    options?: { [p: string ]: unknown }
  } = {
    hosts: mongo.hosts,
    database: mongo.database
  }

  if (mongo.isSRVConnection === 'True') { mongoRes.isSRVConnection = true }
  if (mongo.username !== undefined) { mongoRes.username = mongo.username }
  if (mongo.password !== undefined) { mongoRes.password = mongo.password }

  if (mongo.options !== undefined) {
    let parsedMongoOptions
    try {
      parsedMongoOptions = JSON.parse(mongo.options)
    } catch (err) {
      const castError = err as { message: string }
      throw Error(`An error occurred parsing mongo options: ${castError.message}`)
    }
    mongoRes.options = parsedMongoOptions
  }

  if (typeof sensorData.resourceName !== 'string') {
    throw new TypeError('The type of logging.level has to be a string')
  }

  return Object.freeze({
    nodeEnv,
    port: parseInt(port, 10),
    logging: { level: logging.level },
    mongo: mongoRes,
    sensorData: { resourceName: sensorData.resourceName }
  })
}
