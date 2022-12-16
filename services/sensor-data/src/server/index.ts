import util from 'node:util'
import type { Server } from 'node:http'
import express from 'express'
import type { Express } from 'express'

import { middleware as OpenApiValidatorMiddleware } from 'express-openapi-validator'
import { openApiErrorHandler } from '@changestream-poc/middleware'

import openApiDocument from './apiSpec'
import apiDocsRouter from './routes/apiDocs'
import rootRouter from './routes/root'
import uptimeRouter from './routes/uptime'
import sensorDataRouter from './routes/sensorData'

import { config, configProvider } from './config'
import { logger } from './singletons'
import { mongoDBDriver } from '../client/singletons'

export const server: Express = express()

const { port } = configProvider(config)

/** Middlewares */
server.use(express.json())
server.use(express.text())
server.use(express.urlencoded({ extended: false }))
server.use(OpenApiValidatorMiddleware({
  apiSpec: openApiDocument,
  validateRequests: true
}))

/** Routers */
server.use('/', rootRouter)
server.use('/uptime', uptimeRouter)
server.use('/api-docs', apiDocsRouter)
server.use('/data', sensorDataRouter)

/** Error handlers */
server.use(openApiErrorHandler)

let runningServer: Server
let boundPromClose: () => Promise<void>
export default {
  listen () {
    runningServer = server.listen(port, () => logger.info(`The http server is listening on port ${port}!`))
    const promClose = util.promisify(runningServer.close)
    boundPromClose = promClose.bind(runningServer)
  },

  async close (): Promise<void> {
    await mongoDBDriver.close()
    logger.info('The server db connection is closed')
    if (boundPromClose !== undefined) {
      await boundPromClose()
      logger.info('The http server stopped listening')
      return
    }
    logger.warn('There is no http server to close')
  }
}
