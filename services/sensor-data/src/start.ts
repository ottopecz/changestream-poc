import * as dotenv from 'dotenv'
dotenv.config()
/* eslint-disable import/first */
import app from './app'
import { config, configProvider } from './config'
import { logger } from './singletons'
/* eslint-enable import/first */

const { port } = configProvider(config)
const server = app.listen(port, () => logger.info(`App listening on port ${port}!`))
process
  .on('SIGTERM', () => {
    logger.info('SIGTERM received')
    server.close(() => process.exit(0))
  })
  .on('SIGINT', () => {
    logger.info('SIGINT received')
    server.close(() => process.exit(0))
  })
  .on('uncaughtException', (error: Error) => {
    const errorMessage: string = (error.message !== '') ? `Uncaught Exception: ${error.message}` : 'Uncaught Exception'
    logger.error(errorMessage, error)
    server.close(() => process.exit(1))
  })
  .on('unhandledRejection', (error: Error) => {
    const errorMessage: string = (error.message !== '') ? `Uncaught Exception: ${error.message}` : 'Uncaught Exception'
    logger.error(errorMessage, error)
    server.close(() => process.exit(1))
  })
