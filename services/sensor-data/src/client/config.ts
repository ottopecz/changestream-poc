import baseConfig from '../config'

export const config = Object.freeze({
  ...baseConfig,
  sensorData: {
    from: process.env.SENSOR_DATA_SINCE,
    to: process.env.SENSOR_DATA_UNTIL,
    alertUrl: process.env.SENSOR_DATA_ALERT_URL
  }
})

interface ConfigProviderInput {
  nodeEnv: unknown
  logging: { level: unknown }
  mongo: {
    hosts: unknown
    database: unknown
    collection: unknown
    isSRVConnection?: unknown
    username?: unknown
    password?: unknown
    options?: unknown
  }
  sensorData: {
    from: unknown
    to: unknown
    alertUrl: unknown
  }
}

interface ConfigProviderOutput {
  nodeEnv: string
  logging: { level: string }
  mongo: {
    hosts: string
    database: string
    collection: string
    isSRVConnection?: boolean
    username?: string
    password?: string
    options?: { [p: string ]: unknown }
  }
  sensorData: {
    from: number
    to: number
    alertUrl: string
  }
}

export function configProvider ({
  nodeEnv,
  logging,
  mongo,
  sensorData
}: ConfigProviderInput): ConfigProviderOutput {
  if (typeof nodeEnv !== 'string') {
    throw new TypeError('The type of nodeEnv has to be a string')
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

  if (typeof mongo.collection !== 'string') {
    throw new TypeError('The type of mongo.collection has to be a string')
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
    collection: string
    isSRVConnection?: boolean
    username?: string
    password?: string
    options?: { [p: string ]: unknown }
  } = {
    hosts: mongo.hosts,
    database: mongo.database,
    collection: mongo.collection
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

  if (typeof sensorData.from !== 'string') {
    throw new TypeError('The type of sensorData.from has to be a string')
  }

  if (typeof sensorData.to !== 'string') {
    throw new TypeError('The type of sensorData.to has to be a string')
  }

  if (typeof sensorData.alertUrl !== 'string') {
    throw new TypeError('The type of sensorData.alertUrl has to be a string')
  }

  const sensorDataRes: {
    from: number
    to: number
    alertUrl: string
  } = {
    from: parseFloat(sensorData.from),
    to: parseFloat(sensorData.to),
    alertUrl: sensorData.alertUrl
  }

  return Object.freeze({
    nodeEnv,
    logging: { level: logging.level },
    mongo: mongoRes,
    sensorData: sensorDataRes
  })
}
