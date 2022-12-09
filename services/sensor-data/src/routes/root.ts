import { Router } from 'express'
import type { Request, Response } from 'express'
// import { logger } from '../singletons'

const router = Router()

router.get('/', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'plain/text')

  // let condition = 'available'
  // try {
  //   await mongoDBDriver.getDb()
  // } catch (err) {
  //   logger.error('An error occurred health-checking database', { error: err })
  //   condition = 'unavailable'
  // }

  res.status(200).send('Good')
})

export default router
