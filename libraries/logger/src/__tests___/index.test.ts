import Logger from '../index'

const consoleListener = jest.fn()

jest.mock('winston', () => {
  const originalModule = jest.requireActual('winston')
  const originalTransports = originalModule.transports

  return {
    ...originalModule,
    transports: {
      ...originalTransports,
      Console: class Console extends originalModule.Transport {
        log (info: string, callback: Function): void {
          consoleListener(info)
          callback()
        }
      }
    }
  }
})

describe('THE logger', () => {
  const message = 'test message'
  const additional = { param: 'additional' }
  let logger: Logger

  beforeEach(() => {
    logger = new Logger()
  })

  afterEach(() => {
    consoleListener.mockClear()
  })

  describe('WHEN the `error` method is called', () => {
    it('SHOULD log to the console using the simple format', () => {
      logger.error(message, additional)
      expect(consoleListener).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'error', message, ...additional })
      )
    })
  })

  describe('WHEN the `info` method is called', () => {
    it('SHOULD log to the console using the simple format', () => {
      logger.info(message, additional)
      expect(consoleListener).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'info', message, ...additional })
      )
    })
  })

  describe('WHEN the `log` method is called', () => {
    it('SHOULD log to the console using the simple format', () => {
      logger.log(message, additional)
      expect(consoleListener).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'info', message, ...additional })
      )
    })
  })

  describe('WHEN the `warn` method is called', () => {
    it('SHOULD log to the console using the simple format', () => {
      logger.warn(message, additional)
      expect(consoleListener).toHaveBeenCalledWith(
        expect.objectContaining({ level: 'warn', message, ...additional })
      )
    })
  })
})
