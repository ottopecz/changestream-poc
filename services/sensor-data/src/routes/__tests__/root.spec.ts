import supertest from 'supertest'
import MongoDBDriver from '@converge-exercise/mongo-driver'
import server from '../../server'

jest.mock('@converge-exercise/mongo-driver')

const mongoDBDriverGetDb = MongoDBDriver.prototype.getDb as jest.Mock

describe('THE / endpoint', () => {
  describe('WHEN a GET request is made ', () => {
    describe('AND the MongoDBDriver returns a database', () => {
      beforeEach(() => {
        mongoDBDriverGetDb.mockResolvedValueOnce('whatever')
      })

      it('SHOULD respond with 200 ' +
        'AND return the name of the app ' +
        'AND report the availability of the dependency', async () => {
        const { text } = await supertest(server)
          .get('/')
          .expect(200)

        expect(text).toEqual('Sensor Data Service - Database is available')
      })
    })

    describe('AND the MongoDBDriver throws an error ', () => {
      beforeEach(() => {
        mongoDBDriverGetDb.mockRejectedValueOnce(new Error('test')) // The concept of returning awaited promises is just wrong
      })

      it('SHOULD respond with 200 ' +
        'AND return the name of the app ' +
        'AND report the availability of the dependency', async () => {
        const { text } = await supertest(server)
          .get('/')
          .expect(200)

        expect(text).toEqual('Sensor Data Service - Database is unavailable')
      })
    })
  })
})
