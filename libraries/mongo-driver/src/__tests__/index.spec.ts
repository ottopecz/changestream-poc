import { Collection } from 'mongodb'
import MongoDBDriver from '../'

describe("THE MongoDBDriver", () => {
  const errMock = new Error('test')
  const nowMockValue = 0
  const collection = 'test'
  const defaultConfig = {
    hosts: process.env.MONGO_HOSTS || 'localhost:27017',
    database: 'converge-exercise-test'
  }

  let dateNowSpy: jest.SpyInstance
  beforeAll(() => {
    dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => nowMockValue)
  });

  afterAll(() => {
    dateNowSpy.mockRestore()
  });

  describe("WHEN interacting with data", () => {
    let driver: MongoDBDriver

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig });
      return driver.connect()
    })

    afterEach(async () => {
      await driver.close()
    })

    describe('THE \'read\' method', () => {
      const recordCount = 20
      const records = new Array(recordCount).fill(undefined)
        .map((record, index) => ({ item: index }))

      const maxItem = records.length / 2
      const query = { item: { $lte: maxItem } }

      describe('WHEN returns with success', () => {
        beforeEach(async () => {
          const db = await driver.getDb()
          return db.collection(collection).insertMany(records);
        })

        afterEach( async () => {
          const db = await driver.getDb()
          return db.collection(collection).drop()
        })

        it("SHOULD return an array of documents", async () => {
          const driverRecords = await driver.read({ collection, query })
          expect(driverRecords.length).toEqual(maxItem + 1)
          driverRecords.forEach((current) => {
            expect(current.item).toBeLessThanOrEqual(maxItem)
          })
        })
      })

      describe('WHEN there is an error during the database read', () => {
        beforeEach(async () => {
          const db = await driver.getDb()
          const find = jest.fn().mockImplementationOnce(() => Promise.reject(errMock))
          jest.spyOn(db, 'collection').mockImplementationOnce(() => { return { find } as unknown as Collection })
        })

        it('SHOULD throw an IOError', async () => {
          await expect(driver.read({ collection, query })).rejects.toThrow(
            `MongoDBDriver: read error: ${JSON.stringify({ collection, query })}`
          )
        })
      })
    })

    describe('THE \'createOne\' method', () => {
      const doc = { foo: 'bar' }

      describe('WHEN successful', () => {
        afterEach(async () => {
          const db = await driver.getDb()
          return db.collection(collection).drop()
        })

        it('SHOULD create a single document ' +
          'AND add the createdAt property ' +
          'AND add the updatedAt property', async () => {
          const result = await driver.createOne({ collection, doc })
          expect(result).toMatchObject(doc)
          expect(result).toHaveProperty('createdAt', new Date(nowMockValue))
          expect(result).toHaveProperty('updatedAt', new Date(nowMockValue))
          expect(result).toHaveProperty('_id')
        })
      })

      describe('WHEN there is an error during the database create', () => {
        beforeEach(async () => {
          const db = await driver.getDb()
          const insertOne = jest.fn().mockImplementationOnce(() => Promise.reject(errMock))
          jest.spyOn(db, 'collection').mockImplementationOnce(() => { return { insertOne } as unknown as Collection })
        })

        it('SHOULD throw an IOError', () => {
          return expect(driver.createOne({ collection, doc: { foo: 'bar' } })).rejects.toThrow(
            `MongoDBDriver: insertOne error: ${JSON.stringify({ collection, document: doc })}`
          )
        })
      })

      describe('WHEN successful but there is an operation error', () => {
        beforeEach(async () => {
          const db = await driver.getDb()
          const insertOne = jest.fn().mockImplementationOnce(() => Promise.resolve({ result: { ok: 0, n: 0 }, ops: [] })) // Should be { ok: 1, n: 1 }
          jest.spyOn(db, 'collection').mockImplementationOnce(() => { return { insertOne } as unknown as Collection } )
        })

        it('SHOULD throw an IOError', async () => {
          return expect(driver.createOne({ collection, doc: { foo: 'bar' } })).rejects.toThrow(
            'MongoDBDriver: the operation hasn\'t executed properly - operationOk: false, oneDocInserted: false'
          )
        })
      })
    })
  })
})
