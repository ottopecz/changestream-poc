import express from 'express'
import type { Express } from 'express'

import { middleware as OpenApiValidatorMiddleware } from 'express-openapi-validator'
import { openApiErrorHandler } from '@converge-exercise/middleware'

import openApiDocument from './apiSpec'
import apiDocsRouter from './routes/apiDocs'
import rootRouter from './routes/root'
import uptimeRouter from './routes/uptime'
import sensorDataRouter from './routes/sensorData'

const server: Express = express()

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

export default server
