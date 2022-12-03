import { logger } from '@converge-exercise/logger'
import { Server } from 'node:http'
import { inspect } from 'node:util'

export class AppError extends Error {
  private readonly httpStatus?: number
  private readonly cause?: unknown

  constructor ({
    name,
    message,
    httpStatus,
    cause
  }: {
    name: string
    message: string
    httpStatus?: number
    cause?: unknown
  }) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
    this.name = name
    const isHttpStatusSpecified = Boolean(httpStatus)
    if (isHttpStatusSpecified) {
      this.httpStatus = httpStatus
    }
    const isCauseSpecified = Boolean(cause)
    if (isCauseSpecified) {
      this.cause = cause
    }
  }
}

function fatalHandler (httpServer: Server, eventName: string): void {
  logger.error(
    `App received ${eventName} event, try to gracefully close the server`
  )

  async function asyncHandler (): Promise<void> {
    await httpServer.close()
    process.exit(1)
  }

  asyncHandler().catch((error) => handleError(error))
}

function normalizeError (errorToHandle: unknown): AppError {
  if (errorToHandle instanceof AppError) {
    return errorToHandle
  }

  if (errorToHandle instanceof Error) {
    const appError = new AppError({ name: errorToHandle.name, message: errorToHandle.message })
    appError.stack = errorToHandle.stack
    return appError
  }

  const inputType = typeof errorToHandle
  return new AppError({
    name: 'unknown-type',
    message: `Error Handler received a none error instance with type - ${inputType}, value - ${inspect(
      errorToHandle
    )}`
  })
}

export function listenToErrorEvents (httpServer: Server): void {
  process.on('uncaughtException', (error) => handleError(error))

  process.on('unhandledRejection', (reason) => handleError(reason))

  process.on('SIGTERM', () => fatalHandler(httpServer, 'SIGTERM'))

  process.on('SIGINT', () => fatalHandler(httpServer, 'SIGINT'))
}

export function handleError (errorToHandle: unknown): void {
  try {
    const appError: AppError = normalizeError(errorToHandle)
    logger.error(appError.message, appError)
  } catch (handlingError: unknown) {
    process.stdout.write(
      'The error handler failed, here are the handler failure and then the origin error that it tried to handle'
    )
    process.stdout.write(JSON.stringify(handlingError))
    process.stdout.write(JSON.stringify(errorToHandle))
  }
}
