import * as dotenv from 'dotenv'
import express from 'express'
import type { Express } from 'express'

import { middleware as OpenApiValidatorMiddleware } from 'express-openapi-validator'
import { openApiErrorHandler } from '@converge-exercise/middleware'
import openApiDocument from './apiSpec'
import { config, configValidator } from './config'
import { logger } from './singletons'
import apiDocs from './routes/apiDocs'
import rootRouter from './routes/root'
import uptimeRouter from './routes/uptime'
dotenv.config()

const app: Express = express()
const { port } = configValidator(config)

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))

app.use(OpenApiValidatorMiddleware({
  apiSpec: openApiDocument,
  validateRequests: true
}))

app.use('/', rootRouter)
app.use('/uptime', uptimeRouter)
app.use('/api-docs', apiDocs)

app.use(openApiErrorHandler)

if (require.main === module) {
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
}

export default app
