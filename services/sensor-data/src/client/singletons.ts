import Logger from '@changestream-poc/logger'
import MongoDBDriver from '@changestream-poc/mongo-driver'
import AlertClient from '@changestream-poc/internal-alert-client'
import { config, configProvider } from './config'

const validatedConfig = configProvider(config)

export const logger = new Logger()

const { mongo: { hosts, database, isSRVConnection, username, password } } = validatedConfig
export const mongoDBDriver = new MongoDBDriver({ hosts, database, isSRVConnection, username, password })

const { sensorData: { alertUrl } } = validatedConfig
export const alertClient = new AlertClient(alertUrl)
