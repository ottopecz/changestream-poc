import { Server } from 'node:http'
import sinon from 'sinon'
import { logger } from '@converge-exercise/logger'
import { AppError, listenToErrorEvents, handleError } from '..'

beforeEach(() => {
  sinon.restore()
})

describe('handleError', () => {
  test('When uncaughtException emitted, error handled should catch and handle the error properly', () => {
    // Arrange
    const httpServerMock = sinon.createStubInstance(Server)
    const loggerStub = sinon.stub(logger, 'error')
    listenToErrorEvents(httpServerMock)
    const errorName = 'mocking an uncaught exception'
    const errorToEmit = new Error(errorName)

    // Act
    process.emit('uncaughtException', errorToEmit)

    // Assert
    const message = loggerStub.firstCall.args[0]
    const appError = loggerStub.firstCall.args[1]
    expect(loggerStub.callCount).toBe(1)
    expect(message).toBe(errorToEmit.message)
    expect(appError).toMatchObject({
      name: errorToEmit.name,
      message: errorToEmit.message,
      stack: expect.any(String)
    })
  })

  test('When handling an Error instance, should log an AppError instance after receiving an Error instance', () => {
    // Arrange
    const errorToHandle = new Error('mocking pre-known error')
    const stdoutSpy = jest.spyOn(process.stdout, 'write')

    // Act
    handleError(errorToHandle)

    // Assert
    expect(stdoutSpy).toHaveBeenCalled()
  })

  test('When handling AppError, then all the properties are passed to the logger', () => {
    // Arrange
    const errorToHandle = new AppError({
      name: 'invalid-input',
      message: 'missing important field',
      httpStatus: 400,
      cause: new Error('Orig Error')
    })
    const loggerListener = sinon.stub(logger, 'error')

    // Act
    handleError(errorToHandle)

    // Assert
    expect({ loggerCalls: 1 }).toMatchObject({
      loggerCalls: loggerListener.callCount
    })
    expect(loggerListener.lastCall.args).toMatchObject([
      'missing important field',
      {
        name: 'invalid-input',
        httpStatus: 400,
        message: 'missing important field',
        cause: new Error('Orig Error'),
        stack: expect.any(String)
      }
    ])
  })

  test.each([
    1,
    'oops, this error is actually a string!',
    null,
    Infinity,
    false,
    { someKey: 'someValue' },
    [],
    undefined,
    NaN,
    '🐥',
    () => undefined
  ])(
    'When handling an Error instance, should log an AppError instance after receiving unknown type of error',
    (unknownErrorValue) => {
      // Arrange
      const loggerStub = sinon.stub(logger, 'error')

      // Act
      handleError(unknownErrorValue)

      // Assert
      const message = loggerStub.firstCall.args[0]
      const appError = loggerStub.firstCall.args[1]
      expect(loggerStub.callCount).toBe(1)
      expect(message.includes(typeof unknownErrorValue)).toBe(true)
      expect((appError as AppError).name).toBe('unknown-type')
    }
  )
})
