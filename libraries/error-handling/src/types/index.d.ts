import { Server } from 'node:http'

declare module '@converge-exercise/error-handling' {
  export declare class AppError extends Error {
    private readonly httpStatus?
    private readonly cause?
    constructor ({ name, message, httpStatus, cause }: {
      name: string
      message: string
      httpStatus?: number
      cause?: unknown
    })
  }
  export declare function listenToErrorEvents (httpServer: Server): void
  export declare function handleError (errorToHandle: unknown): void
}
