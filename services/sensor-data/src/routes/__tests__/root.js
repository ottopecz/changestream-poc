import supertest from 'supertest'

let app

const mongoGetDb = jest.fn()

beforeAll(() => {
  jest.doMock('@wss-dh/wss.web.package.mongodbdriver', () => {
    return class MockMongoDBDriver {
      getDb (...args) {
        return mongoGetDb(...args)
      }
    }
  })
  app = require('../../app').default
})

afterAll(() => {
  jest.resetModules()
})

describe('THE / endpoint', () => {
  describe('WHEN a GET request is made ', () => {
    describe('AND the MongoDBDriver returns a database', () => {
      beforeEach(() => {
        mongoGetDb.mockImplementation(() => Promise.resolve('database'))
      })

      it('SHOULD respond with 200 ' +
        'AND return the name of the app ' +
        'AND report the availability of the dependency', async () => {
        const { text } = await supertest(app)
          .get('/')
          .expect(200)

        expect(text).toEqual('WSS.Web.App.RegMan - Database is available')
      })
    })

    describe('AND the MongoDBDriver throws an error ', () => {
      beforeEach(() => {
        mongoGetDb.mockImplementation(() => Promise.reject(new Error()))
      })

      it('SHOULD respond with 200 ' +
        'AND return the name of the app ' +
        'AND report the availability of the dependency', async () => {
        const { text } = await supertest(app)
          .get('/')
          .expect(200)

        expect(text).toEqual('WSS.Web.App.RegMan - Database is unavailable')
      })
    })
  })
})
