import Logger from '@converge-exercise/logger'
import MongoDBDriver from '@converge-exercise/mongo-driver'
import { config, configProvider } from './config'

export const logger = new Logger()

const { mongo: { hosts, database, username, password } } = configProvider(config)
export const mongoDBDriver = new MongoDBDriver({ hosts, database, username, password })
