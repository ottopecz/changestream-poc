import Logger from '@changestream-poc/logger'
import MongoDBDriver from '@changestream-poc/mongo-driver'
import { NotificationData, AlertNotificationContext, SensorAlertNotificationContext } from '../sharedTypes'
import { DataRepo, NotificationDataRepo, NotificationDataDBdriverType } from './dataRepos'
import { config, configProvider } from './config'

export const logger = new Logger()

const { mongo: { hosts, database, isSRVConnection, username, password } } = configProvider(config)
export const mongoDBDriver = new MongoDBDriver({ hosts, database, isSRVConnection, username, password })

const { notificationData: { resourceName } } = configProvider(config)
export const notificationDataRepo: DataRepo<NotificationData<AlertNotificationContext<SensorAlertNotificationContext>>> = new NotificationDataRepo({ resourceName, dbDriver: mongoDBDriver as unknown as NotificationDataDBdriverType }) // Ugh...
