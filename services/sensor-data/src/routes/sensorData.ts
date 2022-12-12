import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { ConflictError } from '@converge-exercise/errors'
import { SensorDataType } from '../dataRepos'
import { logger, sensorDataRepo } from '../singletons'

const router = Router()

router.put('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => { // eslint-disable-line @typescript-eslint/no-misused-promises
  const { body }: { body: SensorDataType } = req

  try {
    await sensorDataRepo.add(body)
  } catch (err) {
    if (err instanceof ConflictError) {
      logger.warn('A conflict occurred when trying to add sensor data', body)
      res
        .setHeader('Content-Type', 'text/html')
        .status(409)
        .end()
      return
    }
    logger.error('An unexpected error occurred when trying to add sensor data', err)
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
