declare module '@converge-exercise/logger' {
  export class LoggerWrapper {
    private readonly underlyingLogger

    configureLogger (configuration: LoggerConfiguration, overrideIfExists?: boolean): void

    resetLogger (): void

    debug (message: string, ...args: unknown[]): void

    error (message: string, ...args: unknown[]): void

    info (message: string, ...args: unknown[]): void

    warning (message: string, ...args: unknown[]): void
  }

  export const logger: LoggerWrapper
}
