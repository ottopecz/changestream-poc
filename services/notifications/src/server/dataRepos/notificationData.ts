import { IOError } from '@changestream-poc/errors'
import type { NotificationData, AlertNotificationContext, SensorAlertNotificationContext } from '../../sharedTypes'
import type { DataRepo } from './types'

export interface NotificationDataDBdriverType {
  createOne: ({ collection, doc }: {
    collection: string
    doc: NotificationData<AlertNotificationContext<SensorAlertNotificationContext>>
  }) => Promise<unknown>
}

export class NotificationDataRepo implements DataRepo<NotificationData<AlertNotificationContext<SensorAlertNotificationContext>>> {
  private readonly resourceName: string
  private readonly dbDriver: NotificationDataDBdriverType

  constructor ({ resourceName, dbDriver }: { resourceName: string, dbDriver: NotificationDataDBdriverType }) {
    this.resourceName = resourceName
    this.dbDriver = dbDriver
  }

  async add (notificationData: NotificationData<AlertNotificationContext<SensorAlertNotificationContext>>): Promise<unknown> {
    let result
    try {
      result = await this.dbDriver.createOne({ collection: this.resourceName, doc: notificationData })
    } catch (err) {
      const { origError }: IOError = err as IOError
      throw new IOError('An unexpected error occurred adding Notification Data record', {
        origError,
        context: { notificationData }
      })
    }
    return result
  }
}
