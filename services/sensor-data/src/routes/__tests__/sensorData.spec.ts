import supertest from 'supertest'
import server from '../../app'
import { MongoClient } from 'mongodb'
import { IOError } from '@converge-exercise/errors'
import { config, configProvider } from '../../config'
import { mongoDBDriver } from '../../singletons'
import sensorData from './__fixtures__/sensorData.json'

jest.mock('@converge-exercise/mongo-driver', () => {
  const origModule = jest.requireActual('@converge-exercise/mongo-driver')
  origModule.default.prototype.createOne = jest.fn(origModule.default.prototype.createOne)
  origModule.default.prototype.read = jest.fn(origModule.default.prototype.read)
  return origModule
})

const mockedMongoDBDriverCreateOne = mongoDBDriver.createOne as jest.Mock
const {
  mongo: { hosts, database, username, password },
  sensorData: { resourceName: RESOURCE_NAME }
} = configProvider(config)
let client: MongoClient

beforeAll(async () => {
  client = await MongoClient.connect(`mongodb://${(username !== undefined) ? username : ''}:${(password !== undefined) ? password : ''}@${hosts}/${database}`)
})

afterAll(async () => {
  return await Promise.all([mongoDBDriver.client.close(), client.close()])
})

describe('THE /data endpoint', () => {
  beforeEach(async () => {
    return await client.db().collection(RESOURCE_NAME).createIndex(
      { sensorId: 1, time: 1 },
      { unique: true }
    )
  })
  afterEach(async () => await client.db().collection(RESOURCE_NAME).drop())

  describe('AND a PUT request is made', () => {
    describe('AND the request is not properly formulated', () => {
      describe('AND the sensorId is missing from the body', () => {
        const { time, value } = sensorData
        const invalidBody = { time, value }

        it('SHOULD respond with 400', async () => {
          return await supertest(server)
            .put('/data')
            .send(invalidBody)
            .expect(400)
        })
      })

      describe('AND the time is missing from the body', () => {
        describe('AND the time is missing from the body', () => {
          const { sensorId, value } = sensorData
          const invalidBody = { sensorId, value }

          it('SHOULD respond with 400', async () => {
            return await supertest(server)
              .put('/data')
              .send(invalidBody)
              .expect(400)
          })
        })
      })
    })

    describe('AND the request is properly formulated', () => {
      const validBody = sensorData

      describe('AND the underlying IO request throws', () => {
        beforeEach(() => {
          mockedMongoDBDriverCreateOne.mockRejectedValueOnce(new IOError('Thrown by the Mongo Driver', { origError: new Error('test') }))
        })

        it('SHOULD respond with 500 ' +
          'AND return a standard express html error page', (done) => {
          void supertest(server)
            .put('/data')
            .send(validBody)
            .expect(500)
            .end((err: Error, res) => {
              if (err !== undefined) {
                return done(err)
              }
              expect(res.text).toEqual(expect.stringContaining('IOError: Thrown by the Mongo Driver'))
              return done()
            })
        })
      })

      describe('AND the underlying IO request doesn\'t throw', () => {
        describe('AND writing the record causes a conflict', () => {
          beforeEach(async () => await client.db().collection(RESOURCE_NAME).insertOne(sensorData))

          it('SHOULD respond with 409 ' +
            'AND NOT write the document into the database', async () => {
            const { sensorId, time } = sensorData
            const beforeCursor = client.db().collection(RESOURCE_NAME).find({ sensorId, time })
            const beforeResult = await beforeCursor.toArray()

            await supertest(server)
              .put('/data')
              .send(validBody)
              .expect(409)

            const afterCursor = client.db().collection(RESOURCE_NAME).find({ sensorId, time })
            const afterResult = await afterCursor.toArray()

            return expect(beforeResult.length).toBe(afterResult.length)
          })
        })

        describe('AND writing the record succeeds', () => {
          it('SHOULD respond with 204 ' +
            'AND write the document into the database', async () => {
            await supertest(server)
              .put('/data')
              .send(validBody)
              .expect(204)

            const { sensorId, time } = sensorData
            const result = await client.db().collection(RESOURCE_NAME).findOne({ sensorId, time })
            return expect(result).toMatchObject(sensorData)
          })
        })
      })
    })
  })
})
