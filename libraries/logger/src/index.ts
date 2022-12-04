import winston from 'winston'

export default class Logger {
  private readonly logger: winston.Logger

  constructor () {
    this.logger = winston.createLogger({
      transports: [new winston.transports.Console()]
    })
  }

  debug (message: string, ...args: any[]): void {
    this.logger.log('debug', message, ...args)
  }

  error (message: string, ...args: any[]): void {
    this.logger.log('error', message, ...args)
  }

  info (message: string, ...args: any[]): void {
    this.logger.log('info', message, ...args)
  }

  log (message: string, ...args: any[]): void {
    this.info(message, ...args)
  }

  warn (message: string, ...args: any[]): void {
    this.logger.log('warn', message, ...args)
  }
}
