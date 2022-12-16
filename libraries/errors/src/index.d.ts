declare module '@changestream-poc/errors' {

  /** Represents an error which indicates a conflict */
  export declare class ConflictError extends Error {
    readonly errorMessage: string
    readonly origError: Error | undefined
    readonly statusCode: number | undefined
    readonly errorCode: string | undefined
    readonly context: {
      [p: string]: unknown
    } | undefined
    constructor (message: string, { origError, statusCode, errorCode, context }?: {
      origError?: Error
      statusCode?: number
      errorCode?: string
      context?: {
        [p: string]: unknown
      }
    })
  }

  /** Represents an error which occurs during IO operations */
  export declare class IOError extends Error {
    readonly errorMessage: string
    readonly origError: Error | undefined
    readonly statusCode: number | undefined
    readonly errorCode: string | undefined
    readonly context: {
      [p: string]: unknown
    } | undefined
    constructor (message: string, { origError, statusCode, errorCode, context }?: {
      origError?: Error
      statusCode?: number
      errorCode?: string
      context?: {
        [p: string]: unknown
      }
    })
  }

  /** Represents an error which occurs validation foreign data. It's supposed used for http errors. */
  export declare class ValidationError extends Error {
    readonly errorMessage: string
    readonly origErrors: Error[] | undefined
    readonly statusCode: number | undefined
    readonly errorCode: string | undefined
    readonly context: {
      [p: string]: unknown
    } | undefined
    constructor (message: string, { origErrors, statusCode, errorCode, context }?: {
      origErrors?: Error[]
      statusCode?: number
      errorCode?: string
      context?: {
        [p: string]: unknown
      }
    })
  }
}
