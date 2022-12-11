import { Router } from 'express'
import type { Request, Response } from 'express'
import { ConflictError } from '@converge-exercise/errors'
import { SensorDataType } from '../dataRepos'
import { logger, sensorDataRepo } from '../singletons'

const router = Router()

router.put('/', async (req: Request, res: Response) => { // eslint-disable-line @typescript-eslint/no-misused-promises
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
    }
  }

  logger.info('A a sensor data record is successfully added', body)
  res
    .setHeader('Content-Type', 'text/html')
    .status(204)
    .end()
})

export default router
