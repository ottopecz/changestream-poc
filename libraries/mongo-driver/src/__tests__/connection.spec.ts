import { MongoClient, Db } from 'mongodb'
import MongoDBDriver from '../'

jest.mock('mongodb')

const mongoClientConnect = MongoClient.connect as jest.Mock

function defer <T> (): { promise: Promise<T>, resolve: (arg0: T) => void, reject: (arg0: Error) => void } {
  let res: (arg0: T) => void
  let rej: (arg0: Error) => void

  const promise = new Promise((resolve: (arg0: T) => void, reject: (arg0: Error) => void) => {
    res = resolve
    rej = reject
  })

  return {
    promise,
    resolve (...args: [T]) {
      return res(...args)
    },
    reject (...args: [Error]) {
      return rej(...args)
    }
  }
}

describe('THE MongoDBDriver', () => {
  const defaultConfig = {
    hosts: process.env.MONGO_HOSTS ?? 'localhost:27017',
    database: 'changestream-poc_mongo-test-db',
    username: 'user',
    password: 'userpassword'
  }

  const defaultSRVConfig = {
    isSRVConnection: true
  }

  const defaultAuthConfig = {
    username: 'mock-username',
    password: 'm/0: ck ++ password ?? ://'
  }

  const defaultTls = {
    tlsCertificateFile: '/usr/mock-certificate.pem'
  }

  const defaultSsl = {
    sslCertificate: Buffer.from('mock certificate', 'utf8').toString()
  }

  const mockError = new Error('Mock error')

  describe('WHEN a MongoDBDriver is created with basic connection options', () => {
    it('SHOULD instantiate ok', () => {
      expect(() => new MongoDBDriver({ ...defaultConfig }))
        .not.toThrow()
    })
  })

  describe('WHEN a MongoDBDriver is created with basic connection options', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const close = jest.fn()
    const client = { db, close }

    beforeEach(() => {
      db.mockClear()
      close.mockClear()
      driver = new MongoDBDriver({ ...defaultConfig })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      describe('WHEN the connection is successful', () => {
        it('SHOULD have connected and returned the current connection database', async () => {
          const connection = await driver.connect()
          const expectedConnectionString = `mongodb://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.hosts}/${defaultConfig.database}`
          const expectedConnectionOptions = {}
          expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, expectedConnectionOptions)
          expect(driver.client).toBe(client)
          expect(db).toBeCalledWith(defaultConfig.database)
          expect(driver.db).toBe(database)
          expect(connection).toBe(driver.db)
        })
      })

      describe('WHEN the connection is unsuccessful', () => {
        beforeEach(() => {
          mongoClientConnect.mockImplementation(async () => await Promise.reject(mockError))
        })

        it('SHOULD throw an IOError containing a sanitised version of the connection string', async () => {
          await expect(driver.connect()).rejects.toThrow(
            `MongoDBDriver: Error connecting to database: mongodb://${defaultConfig.username}@${defaultConfig.hosts}/${defaultConfig.database}`
          )
        })
      })
    })

    describe('THE \'close\' method', () => {
      describe('WHEN there is an active connection', () => {
        beforeEach(async () => {
          await driver.connect()
        })

        it('SHOULD close the connection', async () => {
          const result = await driver.close()
          expect(result).not.toBeDefined()
          expect(close).toBeCalled()
        })
      })

      describe('WHEN there is no active client', () => {
        beforeEach(() => {
          driver.client = undefined
        })

        it('SHOULD do nothing', async () => {
          const result = await driver.close()
          expect(result).not.toBeDefined()
          expect(close).not.toBeCalled()
        })
      })
    })

    describe('THE \'preConnect\' method', () => {
      // Not active isConnecting
      describe('WHEN there is no pending connection', () => {
        const connection = defer()

        beforeEach(() => {
          mongoClientConnect.mockImplementation(async () => await connection.promise)
        })

        it('SHOULD create a new pending connection which will resolve to the result of the underlying \'connect\' method', async () => {
          expect(driver.isConnecting).toBeNull()
          const pending = driver.preConnect()

          expect(pending).toStrictEqual(driver.isConnecting)
          expect(pending).toEqual(expect.any(Promise))

          connection.resolve(client)

          const connectionResult = await pending

          expect(connectionResult).toEqual(database)
        })
      })

      // Active isConnecting
      describe('WHEN there is a pending connection', () => {
        const connection = defer<Db>()

        beforeEach(() => {
          mongoClientConnect.mockImplementation(async () => await connection.promise)
          driver.isConnecting = connection.promise
        })

        it('SHOULD return the pending connection which will resolve to the result of the underlying \'connect\' method', async () => {
          const pending = driver.preConnect()

          expect(pending).toStrictEqual(driver.isConnecting)
          expect(pending).toEqual(expect.any(Promise))

          connection.resolve(client as unknown as Db)

          const connectionResult = await pending

          expect(connectionResult).toEqual(database)
          expect(driver.isConnecting).toBeNull()
        })
      })

      // isConnecting throws an error
      describe('WHEN the underlying \'connect\' method throws an error', () => {
        const connection = defer<Db>()

        beforeEach(() => {
          mongoClientConnect.mockImplementation(async () => await connection.promise)
          driver.isConnecting = connection.promise
        })

        it('SHOULD remove the pending connection and forward the error', async () => {
          const pending = driver.preConnect()

          expect(pending).toStrictEqual(driver.isConnecting)
          expect(pending).toEqual(expect.any(Promise))

          connection.reject(mockError)

          await expect(pending).rejects.toThrow(
            `MongoDBDriver: Error connecting to database: mongodb://${defaultConfig.username}@${defaultConfig.hosts}/${defaultConfig.database}`
          )

          expect(driver.isConnecting).toBeNull()
        })
      })
    })

    describe('THE \'getDb\' method', () => {
      describe('WHEN there is an active connection', () => {
        beforeEach(async () => {
          await driver.connect()
          jest.spyOn(driver, 'preConnect')
        })

        it('SHOULD return the current connection database', async () => {
          const db = await driver.getDb()
          expect(db).toBe(database)
          expect(driver.preConnect).not.toBeCalled()
        })
      })

      describe('WHEN there is a pending connection', () => {
        const connection = defer<Db>()

        beforeEach(() => {
          driver.isConnecting = connection.promise
          jest.spyOn(driver, 'preConnect')
        })

        it('SHOULD return the pending connection', async () => {
          const pending = driver.getDb()
          expect(pending).toStrictEqual(connection.promise)
          connection.resolve(database as unknown as Db)
          const db = await pending
          expect(db).toBe(database)
          expect(driver.preConnect).not.toBeCalled()
        })
      })

      describe('WHEN there is no connection', () => {
        beforeEach(() => {
          jest.spyOn(driver, 'preConnect')
            .mockImplementation(async () => { return await (Promise.resolve(database) as unknown as Promise<Db>) })
        })

        it('SHOULD call \'preConnect\' and return the pending connection', async () => {
          const db = await driver.getDb()
          expect(driver.preConnect).toBeCalled()
          expect(db).toBe(database)
        })
      })
    })
  })

  describe('WHEN a MongoDBDriver is created with \'username\' and \'password\' options', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const client = { db }

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig, ...defaultAuthConfig })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      it('SHOULD connect to the database', async () => {
        const connection = await driver.connect()
        const expectedConnectionAuth = `${encodeURIComponent(defaultAuthConfig.username)}:${encodeURIComponent(defaultAuthConfig.password)}`
        const expectedConnectionString = `mongodb://${expectedConnectionAuth}@${defaultConfig.hosts}/${defaultConfig.database}`

        expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, {})
        expect(driver.client).toBe(client)
        expect(db).toBeCalledWith(defaultConfig.database)
        expect(driver.db).toBe(database)
        expect(connection).toBe(driver.db)
      })
    })
  })

  describe('WHEN a MongoDBDriver is created with a \'tlsCertificateFile\' option', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const client = { db }

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig, ...defaultTls })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      it('SHOULD connect to the database', async () => {
        const connection = await driver.connect()
        const expectedConnectionString = `mongodb://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.hosts}/${defaultConfig.database}`
        const expectedConnectionOptions = { tls: true, tlsCAFile: defaultTls.tlsCertificateFile }

        expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, expectedConnectionOptions)
        expect(driver.client).toBe(client)
        expect(db).toBeCalledWith(defaultConfig.database)
        expect(driver.db).toBe(database)
        expect(connection).toBe(driver.db)
      })
    })
  })

  describe('WHEN a MongoDBDriver is created with a \'sslCertificate\' option', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const client = { db }

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig, ...defaultSsl })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      it('SHOULD connect to the database', async () => {
        const connection = await driver.connect()
        const expectedConnectionString = `mongodb://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.hosts}/${defaultConfig.database}`
        const expectedConnectionOptions = { ssl: true, sslCA: defaultSsl.sslCertificate }

        expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, expectedConnectionOptions)
        expect(driver.client).toBe(client)
        expect(db).toBeCalledWith(defaultConfig.database)
        expect(driver.db).toBe(database)
        expect(connection).toBe(driver.db)
      })
    })
  })

  describe('WHEN a MongoDBDriver is created with a both a \'tlsCertificateFile\' option and a \'sslCertificate\' option', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const client = { db }

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig, ...defaultSsl, ...defaultTls })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      it('SHOULD connect to the database using only the TLS method', async () => {
        const connection = await driver.connect()
        const expectedConnectionString = `mongodb://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.hosts}/${defaultConfig.database}`
        const expectedConnectionOptions = { tls: true, tlsCAFile: defaultTls.tlsCertificateFile }

        expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, expectedConnectionOptions)
        expect(driver.client).toBe(client)
        expect(db).toBeCalledWith(defaultConfig.database)
        expect(driver.db).toBe(database)
        expect(connection).toBe(driver.db)
      })
    })
  })

  describe('WHEN a MongoDBDriver is created with a both the isSRVConnection flag', () => {
    let driver: MongoDBDriver

    const database = 'database'
    const db = jest.fn(() => (database))
    const client = { db }

    beforeEach(() => {
      driver = new MongoDBDriver({ ...defaultConfig, ...defaultSRVConfig })
      mongoClientConnect.mockImplementation(async () => await Promise.resolve(client))
    })

    describe('THE \'connect\' method', () => {
      it('SHOULD connect to the database using SRV DNS entry and protocol', async () => {
        const connection = await driver.connect()
        const expectedConnectionString = `mongodb+srv://${defaultConfig.username}:${defaultConfig.password}@${defaultConfig.hosts}/${defaultConfig.database}`

        expect(MongoClient.connect).toBeCalledWith(expectedConnectionString, {})
        expect(driver.client).toBe(client)
        expect(db).toBeCalledWith(defaultConfig.database)
        expect(driver.db).toBe(database)
        expect(connection).toBe(driver.db)
      })
    })
  })
})
