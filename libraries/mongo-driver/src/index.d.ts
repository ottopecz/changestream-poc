import { Db } from 'mongodb'

declare module '@converge-exercise/mongo-driver' {
  declare class MongoDBDriver {
    private readonly config
    isConnecting: null | Promise<Db>
    client: MongoClient | undefined
    db: Db | undefined
    constructor ({ hosts, database, username, password, isSRVConnection, sslCertificate, tlsCertificateFile, options }: {
      hosts: string
      database: string
      username?: string
      password?: string
      isSRVConnection?: boolean
      sslCertificate?: string
      tlsCertificateFile?: string
      options?: {
        [p: string]: unknown
      }
    })
    /**
     * Censors password in the connection string so it can be thrown
     *  and potentially logged
     */
    static censorConnectionString (connectionString: string): string
    /**
     * Begin the connection process, save the pending promise on this.isConnecting
     */
    preConnect (): Promise<Db>
    /**
     * Connects to the database and save the returned MongoClient and Db objects
     */
    connect (): Promise<Db>
    /**
     * Close the currently open connection
     */
    close (): Promise<void>
    /**
     * Get a connection
     */
    getDb (): Promise<Db>
    /**
     * Read multiple documents
     */
    read ({ collection, query, skip, limit }: {
      collection: string
      query: {
        [p: string]: unknown
      }
      skip?: number
      limit?: number
    }): Promise<Array<{
      [p: string]: unknown
    }>>
    /**
     * Create a single document
     */
    createOne ({ collection, doc }: {
      collection: string
      doc: {
        [p: string]: unknown
      }
    }): Promise<{
      [p: string]: unknown
    }>
  }
  export default MongoDBDriver
}
