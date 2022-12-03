import { pino, Logger as PinoLoggerImpl, DestinationStream } from 'pino'
import { LOG_LEVELS, Logger } from './types/definition'

export default class PinoLogger implements Logger {
  private readonly logger: PinoLoggerImpl

  constructor (
    private readonly level: LOG_LEVELS,
    private readonly prettyPrintEnabled: boolean,
    private readonly destStream?: DestinationStream | string
  ) {
    const opts = {
      level,
      transport: prettyPrintEnabled
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              sync: true
            }
          }
        : undefined
    }
    this.logger = pino(opts)
  }

  debug (message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args)
  }

  error (message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args)
  }

  info (message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args)
  }

  warning (message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args)
  }
}
