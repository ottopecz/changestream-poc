import Logger from '@changestream-poc/logger'
import MongoDBDriver from '@changestream-poc/mongo-driver'
import { SensorDataType } from '../sharedTypes'
import { DataRepo, SensorDataRepo, SensorDataQueryType, SensorDataDBdriverType } from './dataRepos'
import { config, configProvider } from './config'

export const logger = new Logger()

const { mongo: { hosts, database, isSRVConnection, username, password } } = configProvider(config)
export const mongoDBDriver = new MongoDBDriver({ hosts, database, isSRVConnection, username, password })

const { sensorData: { resourceName } } = configProvider(config)
export const sensorDataRepo: DataRepo<SensorDataType, SensorDataQueryType> = new SensorDataRepo({ resourceName, dbDriver: mongoDBDriver as unknown as SensorDataDBdriverType }) // Ugh...
