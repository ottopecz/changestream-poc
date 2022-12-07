import type { Request, Response, NextFunction } from 'express'
import { ValidationError } from '@converge-exercise/errors'
import { logger } from './singletons'

interface NativeValidationError {
  message?: string
  status: number
  errors: NativeValidationErrorItem[]
}

interface NativeValidationErrorItem extends Error {
  path: string
  message: string
  error_code?: string
}

function isOpenApiError ({ status, message, errors }: NativeValidationError): Boolean {
  return (
    Boolean(status) &&
    Boolean(message) &&
    Boolean(errors) &&
    Array.isArray(errors) &&
    errors.every((error) => error.constructor === Object)
  )
}

export default function openApiErrorHandler (err: NativeValidationError, req: Request, res: Response, next: NextFunction): void {
  // eslint-disable-next-line
  if (isOpenApiError(err)) {
    const { status, message, errors } = err
    logger.error('The request failed validation', new ValidationError(message ?? 'An error occurred validating request', { origErrors: errors }))
    res.status(status).json({ message, errors })
    return
  }
  next(err)
}
