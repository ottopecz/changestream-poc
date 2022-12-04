declare module '@converge-exercise/logger' {
  export default class Logger {
    private readonly logger

    constructor ()

    debug (message: string, ...args: any[]): void

    error (message: string, ...args: any[]): void

    info (message: string, ...args: any[]): void

    log (message: string, ...args: any[]): void

    warn (message: string, ...args: any[]): void
  }
}
