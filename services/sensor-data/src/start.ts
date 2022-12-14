import * as dotenv from 'dotenv'
dotenv.config()
/* eslint-disable import/first */
import server from './server'
import client from './client'

import { logger } from './server/singletons'
/* eslint-enable import/first */

async function start () {
  server.listen()
  await client.listen()
}

start().catch((err: Error) => logger.error('An unexpected error occurred starting the sensor-data service', err))

process
  .on('SIGTERM', async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
    logger.info('SIGTERM received')
    await Promise.all([server.close(), client.close()])
    process.exit(0)
  })
  .on('SIGINT', async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
    logger.info('SIGINT received')
    await Promise.all([server.close(), client.close()])
    process.exit(0)
  })
  .on('uncaughtException', async (error: Error) => { // eslint-disable-line @typescript-eslint/no-misused-promises
    const errorMessage: string = (error.message !== '') ? `Uncaught Exception: ${error.message}` : 'Uncaught Exception'
    logger.error(errorMessage, error)
    await Promise.all([server.close(), client.close()])
    process.exit(1)
  })
  .on('unhandledRejection', async (error: Error) => { // eslint-disable-line @typescript-eslint/no-misused-promises
    const errorMessage: string = (error.message !== '') ? `Uncaught Exception: ${error.message}` : 'Uncaught Exception'
    logger.error(errorMessage, error)
    await Promise.all([server.close(), client.close()])
    process.exit(1)
  })
