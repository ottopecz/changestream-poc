import Logger from '@converge-exercise/logger'
import MongoDBDriver from '@converge-exercise/mongo-driver'
import { DataRepo, SensorDataRepo, SensorDataType, SensorDataQueryType, SensorDataDBdriverType } from './dataRepos'
import { config, configProvider } from './config'

export const logger = new Logger()

const { mongo: { hosts, database, username, password } } = configProvider(config)
export const mongoDBDriver = new MongoDBDriver({ hosts, database, username, password })

const { sensorData: { resourceName } } = configProvider(config)
export const sensorDataRepo: DataRepo<SensorDataType, SensorDataQueryType> = new SensorDataRepo({ resourceName, dbDriver: mongoDBDriver as unknown as SensorDataDBdriverType }) // Ugh...
