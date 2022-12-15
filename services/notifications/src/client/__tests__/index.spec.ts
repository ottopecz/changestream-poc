import { EventEmitter } from 'node:events'
import { Db, ChangeStreamDocument } from 'mongodb'
import MongoDBDriver from '@converge-exercise/mongo-driver'
import ExternalAlertClient, { ExternalAlertData } from '@converge-exercise/external-alert-client'
import { NotificationData, AlertNotificationContext, SensorAlertNotificationContext } from '../../sharedTypes'
import client from '../'

jest.mock('@converge-exercise/mongo-driver')
jest.mock('@converge-exercise/external-alert-client')

const mockedMongoDBDriverGetDb = jest.mocked(MongoDBDriver.prototype.getDb)
const mockedAlertClientSendAlert = jest.mocked(ExternalAlertClient.prototype.sendAlert)
const barefootEventEmitter = new EventEmitter()

interface MockChangeStreamDocument {
  operationType: ChangeStreamDocument['operationType']
  fullDocument: NotificationData<AlertNotificationContext<SensorAlertNotificationContext>>
}

function mockChangeStreamEventFactory ({
  operationType = 'insert',
  type = 'sensor'
}: {
  operationType?: ChangeStreamDocument['operationType']
  type?: 'sensor'
}): MockChangeStreamDocument {
  return {
    operationType,
    fullDocument: {
      type: 'alert',
      context: {
        type,
        context: {
          reading: {
            sensorId: 'uuid',
            time: 1,
            value: 6.2
          },
          validRange: {
            from: 5,
            to: 6
          }
        }
      }
    }
  }
}

describe('THE client', () => {
  describe('THE change stream handler', () => {
    const mockChangeStream: EventEmitter = barefootEventEmitter

    beforeAll(() => {
      mockedMongoDBDriverGetDb.mockImplementation(async () => {
        return {
          collection () {
            return {
              watch () {
                return mockChangeStream
              }
            }
          }
        } as unknown as Db
      })
    })

    afterEach(() => mockChangeStream.removeAllListeners())

    afterEach(() => mockedAlertClientSendAlert.mockClear())

    describe('WHEN the stream emits a document', () => {
      describe('AND operationType is not \'insert\'', () => {
        const operationType = 'drop' // not insert
        const mockChangeStreamEvent = mockChangeStreamEventFactory({ operationType })

        it('SHOULD not send out the alert event', async () => {
          await client.listen()
          mockChangeStream.emit('change', mockChangeStreamEvent)
          expect(mockedAlertClientSendAlert).not.toHaveBeenCalled()
        })
      })

      describe('AND operationType is \'insert\'', () => {
        const operationType = 'insert'

        describe('AND the alert type is known', () => {
          const mockChangeStreamEvent = mockChangeStreamEventFactory({ operationType, type: 'sensor' })

          it('SHOULD send out the alert event', async () => {
            await client.listen()
            mockChangeStream.emit('change', mockChangeStreamEvent)
            expect(mockedAlertClientSendAlert).toHaveBeenCalledTimes(1)
            const expectedAlertData: ExternalAlertData = {
              text: 'The sensor with with id: uuid showed critical value of: 6.2 at Thu Jan 01 1970'
            }
            expect(mockedAlertClientSendAlert).toHaveBeenCalledWith(expectedAlertData)
          })
        })
      })
    })
  })

  describe('THE listen method', () => {
    let mockChangeStream: MockedEventEmitter
    class MockedEventEmitter extends EventEmitter { on = jest.fn(() => this) }

    beforeAll(() => {
      mockedMongoDBDriverGetDb.mockImplementation(async () => {
        return {
          collection () {
            return {
              watch () {
                return mockChangeStream
              }
            }
          }
        } as unknown as Db
      })
    })

    beforeEach(() => { mockChangeStream = new MockedEventEmitter() })

    it('SHOULD create the change stream ' +
    'AND return the change stream ' +
    'AND register the change event on the change stream', async () => {
      const changeStream = await client.listen()
      expect(changeStream).toBe(mockChangeStream)

      const mockChangeStreamEvent = mockChangeStreamEventFactory({})
      mockChangeStream.emit('change', mockChangeStreamEvent)
      expect(mockChangeStream.on).toHaveBeenCalledTimes(1)
    })
  })

  describe('THE close method', () => {
    class MockEventEmitter extends EventEmitter {
      on = jest.fn(() => this)
      close = jest.fn()
    }
    let mockChangeStream: MockEventEmitter

    beforeEach(async () => {
      mockChangeStream = new MockEventEmitter()
      mockedMongoDBDriverGetDb.mockImplementation(async () => {
        return {
          collection () {
            return {
              watch () {
                return mockChangeStream
              }
            }
          }
        } as unknown as Db
      })
      return await client.listen()
    })

    it('SHOULD close the stream connection' +
        'AND close the mongo connection', async () => {
      await client.close()
      if (mockChangeStream !== undefined) { expect(mockChangeStream.close).toHaveBeenCalledTimes(1) } // TS - Wherefore Art Thou?
    })
  })
})
