import assert from 'assert'
import { MongoClient, Db } from 'mongodb'
import { IOError } from '@converge-exercise/errors'

/**
 * Standardised driver for connecting to and using MongoDB
 *
 * @example
 * import MongoDBDriver from '@wss-dh/wss.web.package.mongodbdriver'
 *
 * const mongoDBDriver = new MongoDBDriver({
 *   database: 'databasename'
 *   hosts: 'host1.wssdh.io:port1,host2.wssdh.io:port2'
 *   username: 'wssDhMongoUser',
 *   password: '**************',
 *   tlsCertificateFile: '/usr/wss-dh-mongo-certificate.pem'
 *   options: {
 *     replicaSet: 'WssDhReplicaSet'
 *   }
 * })
 *
 * await mongoDBDriver.connect()
 * const users = await mongoDBDriver.read({ collection: 'users', query: {} })
 * console.log(users)
 * // [ user1, ..., userN ]
 */
class MongoDBDriver {
  private config: { database: any; password: any; sslCertificate: any; hosts: any; isSRVConnection: any; options: any; tlsCertificateFile: any; username: any };
  public isConnecting: null | Promise<Db>;
  public client: MongoClient | undefined;
  public db: Db | undefined;

  constructor ({
     hosts,
     database,
     username,
     password,
     isSRVConnection = false,
     sslCertificate,
     tlsCertificateFile,
     options
  }: {
    hosts: string;
    database: string;
    username?: string;
    password?: string;
    isSRVConnection?: boolean,
    sslCertificate?: Buffer;
    tlsCertificateFile?: string;
    options?: {[p: string]: unknown}
  }) {
    assert(hosts, 'MongoDBDriver: No hosts supplied to config')
    assert(database, 'MongoDBDriver: No database supplied to config')
    this.config = { isSRVConnection, hosts, database, username, password, sslCertificate, tlsCertificateFile, options }
    this.isConnecting = null
  }

  /**
   * Censors password in the connection string so it can be thrown
   *  and potentially logged
   */
  static censorConnectionString (connectionString: string): string {
    return connectionString.replace(/(\/\/[^:@/]+):[^:@]+@/, '$1@')
  }

  /**
   * Begin the connection process, save the pending promise on this.isConnecting
   */
  public preConnect (): Promise<Db> {
    this.isConnecting = this.connect()
      .finally(() => {
        this.isConnecting = null
      })

    return this.isConnecting
  }

  /**
   * Connects to the database and save the returned MongoClient and Db objects
   */
  async connect (): Promise<Db> {
    const {
      isSRVConnection,
      hosts: connectionHosts,
      database,
      username,
      password,
      sslCertificate,
      tlsCertificateFile,
      options = {}
    } = this.config

    const protocol = isSRVConnection
      ? 'mongodb+srv'
      : 'mongodb'

    const sslOptions = sslCertificate && !tlsCertificateFile
      ? { ssl: true, sslCA: sslCertificate }
      : {}

    const tlsOptions = tlsCertificateFile
      ? { tls: true, tlsCAFile: tlsCertificateFile }
      : {}

    const connectionOptions = isSRVConnection
      ? {
          ...options
        }
      : {
        // https://mongodb.github.io/node-mongodb-native/3.3/reference/unified-topology/
          ...sslOptions,
          ...tlsOptions,
          ...options
        }

    const connectionAuth = username && password ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : ''
    // We assert there should always be a connection database in the constructor
    const connectionDatabase = `/${database}`
    const connectionString = `${protocol}://${connectionAuth}${connectionHosts}${connectionDatabase}`

    let client
    try {
      client = await MongoClient.connect(connectionString, connectionOptions)
    } catch (origError) {
      const safeConnectionString = MongoDBDriver.censorConnectionString(connectionString)
      const message = `MongoDBDriver: Error connecting to database: ${safeConnectionString}`
      throw new IOError(message, { origError: origError as Error })
    }

    this.client = client
    this.db = client.db(database)
    return this.db
  }

  /**
   * Close the currently open connection
   */
  close (): Promise<void> {
    if (this.client) {
      return this.client.close(true)
    }
    return Promise.resolve()
  }

  /**
   * Get a connection
   */
  getDb (): Promise<Db> {
    if (this.client && this.db) {
      return Promise.resolve(this.db)
    }

    return this.isConnecting || this.preConnect()
  }

  /**
   * Read multiple documents
   */
  async read ({
    collection,
    query,
    skip = 0,
    limit = 100
  }: {
    collection: string;
    query: {[p: string]: unknown};
    skip?: number;
    limit?: number;
  }): Promise<Array<{[p: string]: unknown}>> {
    let cursor
    try {
      const db: Db = await this.getDb()
      cursor = await db.collection(collection).find(query)
    } catch (origError) {
      const message = `MongoDBDriver: read error: ${JSON.stringify({ collection, query })}`
      throw new IOError(message, { origError: origError as Error })
    }

    return cursor
      .project({ _id: 0 })
      .skip(skip)
      .limit(limit)
      .toArray()
  }

  /**
   * Create a single document
   */
  async createOne ({ collection, doc }: { collection: string , doc: {[p: string]: unknown} }): Promise<{[p: string]: unknown}> {
    const clonedDoc = { ...doc }
    clonedDoc.createdAt = new Date(Date.now())
    clonedDoc.updatedAt = new Date(Date.now())

    let res
    try {
      const db = await this.getDb()
      res = await db.collection(collection).insertOne(clonedDoc)
    } catch (origError) {
      const message = `MongoDBDriver: insertOne error: ${JSON.stringify({ collection, document: doc })}`
      throw new IOError(message, { origError: origError as Error })
    }
    const { acknowledged, insertedId } = res
    const operationOk = (acknowledged === true)
    const oneDocInserted = (typeof insertedId === 'object')
    const isOperationalError = !(operationOk && oneDocInserted)

    if (isOperationalError) {
      throw new IOError(`MongoDBDriver: the operation hasn't executed properly - operationOk: ${operationOk}, oneDocInserted: ${oneDocInserted}`)
    }

    return clonedDoc
  }
}

export default MongoDBDriver
