import express from 'express'
import type { Express } from 'express'

import { middleware as OpenApiValidatorMiddleware } from 'express-openapi-validator'
import { openApiErrorHandler } from '@converge-exercise/middleware'

import openApiDocument from './apiSpec'
import apiDocs from './routes/apiDocs'
import rootRouter from './routes/root'
import uptimeRouter from './routes/uptime'

const app: Express = express()

/** Middlewares */
app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: false }))
app.use(OpenApiValidatorMiddleware({
  apiSpec: openApiDocument,
  validateRequests: true
}))

/** Routers */
app.use('/', rootRouter)
app.use('/uptime', uptimeRouter)
app.use('/api-docs', apiDocs)

/** Error handlers */
app.use(openApiErrorHandler)

export default app
