/** Represents an error which occurs during IO operations */
export class IOError extends Error {
  public readonly errorMessage: string
  public readonly origError: Error | undefined
  public readonly statusCode: number | undefined
  public readonly errorCode: string | undefined
  public readonly context: { [p: string]: unknown } | undefined

  constructor (
    message: string,
    {
      origError,
      statusCode,
      errorCode,
      context
    }: {
      origError?: Error
      statusCode?: number
      errorCode?: string
      context?: { [p: string]: unknown } } = {}
  ) {
    super(message)

    this.errorMessage = message

    const isOrigErrorDefined = Boolean(origError)
    if (isOrigErrorDefined) {
      this.origError = origError
    }

    const isStatusCodeDefined = Boolean(statusCode)
    if (isStatusCodeDefined) {
      // @ts-expect-error - this has to be a problem of tsc
      if (!(/^[3-5][0-9][0-9]$/).test(statusCode.toString())) {
        throw new Error('The statusCode argument has to be an http error code (3XX|4XX|5XX)')
      }
      this.statusCode = statusCode
    }

    const isErrorCodeDefined = Boolean(errorCode)
    if (isErrorCodeDefined) {
      this.errorCode = errorCode
    }

    const isContextDefined = Boolean(context)
    if (isContextDefined) {
      this.context = context
    }

    this.name = 'IOError'
  }
}

/** Represents an error which occurs validation foreign data. It's supposed used for http errors. */
export class ValidationError extends Error {
  public readonly errorMessage: string
  public readonly origErrors: Error[] | undefined
  public readonly statusCode: number | undefined
  public readonly errorCode: string | undefined
  public readonly context: { [p: string]: unknown } | undefined

  constructor (
    message: string,
    {
      origErrors,
      statusCode,
      errorCode,
      context
    }: {
      origErrors?: Error[]
      statusCode?: number
      errorCode?: string
      context?: { [p: string]: unknown } } = {}
  ) {
    super(message)

    this.errorMessage = message

    const isOrigErrorDefined = Boolean(origErrors)
    if (isOrigErrorDefined) {
      this.origErrors = origErrors
    }

    const isStatusCodeDefined = Boolean(statusCode)
    if (isStatusCodeDefined) {
      // @ts-expect-error - this has to be a problem of tsc
      if (!(/^[3-5][0-9][0-9]$/).test(statusCode.toString())) {
        throw new Error('The statusCode argument has to be an http error code (3XX|4XX|5XX)')
      }
      this.statusCode = statusCode
    }

    const isErrorCodeDefined = Boolean(errorCode)
    if (isErrorCodeDefined) {
      this.errorCode = errorCode
    }

    const isContextDefined = Boolean(context)
    if (isContextDefined) {
      this.context = context
    }

    this.name = 'ValidationError'
  }
}
