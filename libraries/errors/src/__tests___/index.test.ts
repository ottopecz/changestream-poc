import { ConflictError, IOError, ValidationError } from '../'

describe('THE ConflictError constructor', () => {
  describe('WHEN it\'s executed ', () => {
    describe('AND the message parameter defined ', () => {
      describe('AND it\'s a string', () => {
        const message = 'foo'

        it('SHOULD return an instance ' +
          'AND message needs to be defined ' +
          'AND name needs to be set', () => {
          const ioError = new ConflictError(message)
          expect(ioError).toHaveProperty('message', 'foo')
          expect(ioError).toHaveProperty('name', 'ConflictError')
        })

        describe('AND the origError optional parameter is passed ', () => {
          describe('AND it\'s an error', () => {
            const origError = new Error('bar')

            it('SHOULD return an instance ' +
              'AND message needs to be defined ' +
              'AND name needs to be set', () => {
              const ioError = new ConflictError(message, { origError })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('origError', origError)
              expect(ioError).toHaveProperty('name', 'ConflictError')
            })
          })
        })

        describe('AND the statusCode optional parameter is passed', () => {
          describe('AND it\'s an http error code', () => {
            const statusCode = 500

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const ioError = new ConflictError(message, { statusCode })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorMessage', 'foo')
              expect(ioError).toHaveProperty('statusCode', statusCode)
              expect(ioError).toHaveProperty('name', 'ConflictError')
            })
          })

          describe('AND it\'s not an http error code', () => {
            const statusCode = 1234567

            it('SHOULD throw', () => {
              expect(() => new ConflictError(message, { statusCode })).toThrow(new Error('The statusCode argument has to be an http error code (3XX|4XX|5XX)'))
            })
          })
        })

        describe('AND the errorCode optional parameter is passed ', () => {
          describe('AND it\'s a string ', () => {
            const errorCode = 'foo'

            it('SHOULD return an instance ' +
              'AND errorCode needs to be defined', () => {
              const ioError = new ConflictError(message, { errorCode })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorCode', errorCode)
              expect(ioError).toHaveProperty('name', 'ConflictError')
            })
          })
        })

        describe('AND the context optional parameter is passed', () => {
          describe('AND it\'s an object', () => {
            const context = { foo: 'bar' }

            it('SHOULD return an instance ' +
              'AND context needs to be defined', () => {
              const ioError = new ConflictError(message, { context })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorMessage', 'foo')
              expect(ioError).toHaveProperty('context', { foo: 'bar' })
              expect(ioError).toHaveProperty('name', 'ConflictError')
            })
          })
        })
      })
    })

    describe('WHEN included as an origError of another ConflictError', () => {
      it('SHOULD retain the original\'s message when stringified', () => {
        const origErrorMessage = 'Original message'
        const origContext = { baz: 'qux' }
        const origErrorCode = 'FOO'
        const origError = new ConflictError(origErrorMessage, {
          statusCode: 500,
          errorCode: origErrorCode,
          context: origContext
        })
        const error = new ConflictError('New message', {
          statusCode: 400,
          errorCode: 'BAR',
          context: { quux: 'quuz' },
          origError
        })
        const strError = JSON.stringify(error)
        expect(strError).toContain(origErrorMessage)
        expect(strError).toContain(origErrorCode)
        expect(strError).toContain(JSON.stringify(origContext))
      })
    })
  })
})

describe('THE IOError constructor', () => {
  describe('WHEN it\'s executed ', () => {
    describe('AND the message parameter defined ', () => {
      describe('AND it\'s a string', () => {
        const message = 'foo'

        it('SHOULD return an instance ' +
          'AND message needs to be defined ' +
          'AND name needs to be set', () => {
          const ioError = new IOError(message)
          expect(ioError).toHaveProperty('message', 'foo')
          expect(ioError).toHaveProperty('name', 'IOError')
        })

        describe('AND the origError optional parameter is passed ', () => {
          describe('AND it\'s an error', () => {
            const origError = new Error('bar')

            it('SHOULD return an instance ' +
              'AND message needs to be defined ' +
              'AND name needs to be set', () => {
              const ioError = new IOError(message, { origError })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('origError', origError)
              expect(ioError).toHaveProperty('name', 'IOError')
            })
          })
        })

        describe('AND the statusCode optional parameter is passed', () => {
          describe('AND it\'s an http error code', () => {
            const statusCode = 500

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const ioError = new IOError(message, { statusCode })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorMessage', 'foo')
              expect(ioError).toHaveProperty('statusCode', statusCode)
              expect(ioError).toHaveProperty('name', 'IOError')
            })
          })

          describe('AND it\'s not an http error code', () => {
            const statusCode = 1234567

            it('SHOULD throw', () => {
              expect(() => new IOError(message, { statusCode })).toThrow(new Error('The statusCode argument has to be an http error code (3XX|4XX|5XX)'))
            })
          })
        })

        describe('AND the errorCode optional parameter is passed ', () => {
          describe('AND it\'s a string ', () => {
            const errorCode = 'foo'

            it('SHOULD return an instance ' +
              'AND errorCode needs to be defined', () => {
              const ioError = new IOError(message, { errorCode })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorCode', errorCode)
              expect(ioError).toHaveProperty('name', 'IOError')
            })
          })
        })

        describe('AND the context optional parameter is passed', () => {
          describe('AND it\'s an object', () => {
            const context = { foo: 'bar' }

            it('SHOULD return an instance ' +
              'AND context needs to be defined', () => {
              const ioError = new IOError(message, { context })
              expect(ioError).toHaveProperty('message', 'foo')
              expect(ioError).toHaveProperty('errorMessage', 'foo')
              expect(ioError).toHaveProperty('context', { foo: 'bar' })
              expect(ioError).toHaveProperty('name', 'IOError')
            })
          })
        })
      })
    })

    describe('WHEN included as an origError of another IOError', () => {
      it('SHOULD retain the original\'s message when stringified', () => {
        const origErrorMessage = 'Original message'
        const origContext = { baz: 'qux' }
        const origErrorCode = 'FOO'
        const origError = new IOError(origErrorMessage, {
          statusCode: 500,
          errorCode: origErrorCode,
          context: origContext
        })
        const error = new IOError('New message', {
          statusCode: 400,
          errorCode: 'BAR',
          context: { quux: 'quuz' },
          origError
        })
        const strError = JSON.stringify(error)
        expect(strError).toContain(origErrorMessage)
        expect(strError).toContain(origErrorCode)
        expect(strError).toContain(JSON.stringify(origContext))
      })
    })
  })
})

describe('THE ValidationError constructor', () => {
  describe('WHEN it\'s executed ', () => {
    describe('AND the message parameter defined ', () => {
      describe('AND it\'s a string', () => {
        const message = 'foo'

        it('SHOULD return an instance ' +
          'AND message needs to be defined', () => {
          const validationError = new ValidationError(message)
          expect(validationError).toHaveProperty('message', 'foo')
          expect(validationError).toHaveProperty('name', 'ValidationError')
        })

        describe('AND the origErrors optional parameter is passed ', () => {
          describe('AND it\'s an array ', () => {
            const origErrors = [new Error('test')]

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const validationError = new ValidationError(message, { origErrors })
              expect(validationError).toHaveProperty('message', 'foo')
              expect(validationError).toHaveProperty('origErrors', origErrors)
              expect(validationError).toHaveProperty('name', 'ValidationError')
            })
          })
        })

        describe('AND the statusCode optional parameter is passed', () => {
          describe('AND it\'s an http error code', () => {
            const statusCode = 500

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const validationError = new ValidationError(message, { statusCode })
              expect(validationError).toHaveProperty('message', 'foo')
              expect(validationError).toHaveProperty('errorMessage', 'foo')
              expect(validationError).toHaveProperty('statusCode', statusCode)
              expect(validationError).toHaveProperty('name', 'ValidationError')
            })
          })

          describe('AND it\'s not an http error code', () => {
            const statusCode = 1234567

            it('SHOULD throw', () => {
              expect(() => new ValidationError(message, { statusCode })).toThrow(new Error('The statusCode argument has to be an http error code (3XX|4XX|5XX)'))
            })
          })
        })

        describe('AND the errorCode optional parameter is passed ', () => {
          describe('AND it\'s a string ', () => {
            const errorCode = 'foo'

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const validationError = new ValidationError(message, { errorCode })
              expect(validationError).toHaveProperty('message', 'foo')
              expect(validationError).toHaveProperty('errorCode', errorCode)
              expect(validationError).toHaveProperty('name', 'ValidationError')
            })
          })
        })

        describe('AND the context optional parameter is passed', () => {
          describe('AND it\'s an object', () => {
            const context = { foo: 'bar' }

            it('SHOULD return an instance ' +
              'AND message needs to be defined', () => {
              const validationError = new ValidationError(message, { context })
              expect(validationError).toHaveProperty('message', 'foo')
              expect(validationError).toHaveProperty('errorMessage', 'foo')
              expect(validationError).toHaveProperty('context', { foo: 'bar' })
              expect(validationError).toHaveProperty('name', 'ValidationError')
            })
          })
        })
      })
    })

    describe('WHEN included as an origError of another ValidationError', () => {
      it('SHOULD retain the original\'s message when stringified', () => {
        const origErrorMessage = 'Original message'
        const origContext = { baz: 'qux' }
        const origErrorCode = 'FOO'
        const origError = new ValidationError(origErrorMessage, {
          statusCode: 500,
          errorCode: origErrorCode,
          context: origContext
        })
        const error = new ValidationError('New message', {
          statusCode: 400,
          errorCode: 'BAR',
          context: { quux: 'quuz' },
          origErrors: [origError]
        })
        const strError = JSON.stringify(error)
        expect(strError).toContain(origErrorMessage)
        expect(strError).toContain(origErrorCode)
        expect(strError).toContain(JSON.stringify(origContext))
      })
    })
  })
})
