import supertest from 'supertest'
import server from '../../app'
import { MongoClient } from 'mongodb'
import { config, configProvider } from '../../config'
import { mongoDBDriver } from '../../singletons'
import sensorData from './__fixtures__/sensorData.json'

jest.mock('@converge-exercise/mongo-driver', () => {
  const origModule = jest.requireActual('@converge-exercise/mongo-driver')
  origModule.default.prototype.createOne = jest.fn(origModule.default.prototype.createOne)
  origModule.default.prototype.read = jest.fn(origModule.default.prototype.read)
  return origModule
})

const RESOURCE_NAME = 'sensor-data'
const { mongo: { hosts, database, username, password } } = configProvider(config)
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

  describe('WHEN a PUT request is made ', () => {
    describe('AND writing the record causes a conflict', () => {
      beforeEach(async () => await client.db().collection(RESOURCE_NAME).insertOne(sensorData))

      it('SHOULD respond with 409', async () => {
        return await supertest(server)
          .put('/data')
          .send(sensorData)
          .expect(409)
      })
    })

    describe('AND writing the record succeeds', () => {
      it('SHOULD respond with 204', async () => {
        return await supertest(server)
          .put('/data')
          .send(sensorData)
          .expect(204)
      })
    })
  })
})
