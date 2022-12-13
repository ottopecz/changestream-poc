import { Router } from 'express'
import type { Request, Response } from 'express'
import { logger, mongoDBDriver } from '../singletons'

const router = Router()

router.get('/', async (req: Request, res: Response) => { // eslint-disable-line @typescript-eslint/no-misused-promises
  let condition = 'available'
  try {
    await mongoDBDriver.getDb()
  } catch (err) {
    logger.error('An error occurred health-checking database', { error: err })
    condition = 'unavailable'
  }

  res
    .setHeader('Content-Type', 'text/html')
    .status(200)
    .send(`Sensor Data Service - Database is ${condition}`)
})

export default router
