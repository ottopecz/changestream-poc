import { Router } from 'express'
import type { Request, Response, NextFunction } from 'express'
import { ConflictError } from '@converge-exercise/errors'
import { SensorDataType, SensorDataQueryType } from '../dataRepos'
import { logger, sensorDataRepo } from '../singletons'

const router = Router()

router.put('/', async (req: Request<{}, {}, SensorDataType, {}>, res: Response, next: NextFunction): Promise<void> => { // eslint-disable-line @typescript-eslint/no-misused-promises
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

router.get('/', async (req: Request<{}, {}, {}, SensorDataQueryType>, res: Response, next: NextFunction): Promise<void> => { // eslint-disable-line @typescript-eslint/no-misused-promises
  const { query }: { query: SensorDataQueryType } = req

  let results: SensorDataType[]
  try {
    results = await sensorDataRepo.fetch(query)
  } catch (err) {
    logger.error('An unexpected error occurred when trying to add sensor data', err)
    next(err)
    return
  }

  logger.info('A sensor data records are successfully retrieved', query)
  res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .json(results)
})

export default router
