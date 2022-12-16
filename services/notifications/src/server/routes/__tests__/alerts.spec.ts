import supertest from 'supertest'
import { Express } from 'express'
import { server } from '../../index'
import { MongoClient } from 'mongodb'
import { IOError } from '@changestream-poc/errors'
import { config, configProvider } from '../../config'
import { mongoDBDriver } from '../../singletons'
import sensorAlertData from './__fixtures__/sensorAlertData.json'

jest.mock('@changestream-poc/mongo-driver', () => {
  const origModule = jest.requireActual('@changestream-poc/mongo-driver')
  origModule.default.prototype.createOne = jest.fn(origModule.default.prototype.createOne)
  return origModule
})

export interface TypedResponseBody<T> extends Express.Response {
  body: T
}

const mockedMongoDBDriverCreateOne = jest.mocked(mongoDBDriver.createOne)
const {
  mongo: { hosts, database, username, password },
  notificationData: { resourceName: RESOURCE_NAME }
} = configProvider(config)
let client: MongoClient

describe('THE /alerts endpoint', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(`mongodb://${(username !== undefined) ? username : ''}:${(password !== undefined) ? password : ''}@${hosts}/${database}`)
  })

  afterAll(async () => {
    if (mongoDBDriver.client !== undefined) {
      await mongoDBDriver.client.close()
    }
    return await client.close()
  })

  describe('AND a PUT request is made', () => {
    describe('AND the request is not properly formulated', () => {
      const invalidBody = { foo: 'bar' }

      it('SHOULD respond with 400', async () => {
        return await supertest(server)
          .put('/alerts')
          .send(invalidBody)
          .expect(400)
      })
    })

    describe('AND the request is properly formulated', () => {
      const validBody = sensorAlertData

      describe('AND the underlying IO request throws', () => {
        beforeEach(() => {
          mockedMongoDBDriverCreateOne.mockRejectedValueOnce(new IOError('Thrown by the Mongo Driver', { origError: new Error('Some IO operation failed') }))
        })

        it('SHOULD respond with 500 ' +
          'AND return a standard express html error page', async () => {
          const res = await supertest(server)
            .put('/alerts')
            .send(validBody)
            .expect(500)

          expect(res.text).toEqual(expect.stringContaining('IOError: An unexpected error occurred adding Notification Data record'))
        })
      })

      describe('AND the underlying IO request doesn\'t throw', () => {
        afterEach(async () => await client.db().collection(RESOURCE_NAME).drop())

        it('SHOULD respond with 204 ' +
            'AND write the document into the database', async () => {
          await supertest(server)
            .put('/alerts')
            .send(validBody)
            .expect(204)

          const result = await client.db().collection(RESOURCE_NAME).findOne({ type: 'alert' })
          return expect(result).toMatchObject({ type: 'alert', context: sensorAlertData })
        })
      })
    })
  })
})
