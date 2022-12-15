import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { NotificationData, AlertNotificationContext, SensorAlertNotificationContext } from '../../sharedTypes'
import { logger, notificationDataRepo } from '../singletons'

const router = Router()

router.put('/', async ( // eslint-disable-line @typescript-eslint/no-misused-promises
  req: Request<{}, {}, AlertNotificationContext<SensorAlertNotificationContext>, {}>,
  res: Response,
  next: NextFunction
): Promise<void> => { // eslint-disable-line @typescript-eslint/no-misused-promises
  const { body } = req
  const notificaton: NotificationData<AlertNotificationContext<SensorAlertNotificationContext>> = { type: 'alert', context: body }

  try {
    await notificationDataRepo.add(notificaton)
  } catch (err) {
    logger.error('An unexpected error occurred trying to add notification', err)
    next(err)
    return
  }

  logger.info('A sensor data record is successfully added', body)
  res
    .setHeader('Content-Type', 'text/html')
    .status(204)
    .end()
})

export default router
