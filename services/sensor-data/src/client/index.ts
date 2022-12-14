import { ChangeStream, Db } from 'mongodb'
import { logger, mongoDBDriver } from './singletons'
import { config, configProvider } from './config'

const { mongo: { collection } } = configProvider(config)

let changeStream: ChangeStream

export default {
  async listen (): Promise<ChangeStream> {
    const db: Db = await mongoDBDriver.getDb()
    const coll = db.collection(collection)
    changeStream = coll.watch([], { fullDocument: 'updateLookup' })
    changeStream.on('change', (next) => {
      logger.info('The next document', next)
    })
    logger.info('The change stream is opened')
    return changeStream
  },

  async close (): Promise<void> {
    if (changeStream !== undefined) {
      await changeStream.close()
      logger.info('The change stream is closed')
      return
    }
    logger.warn('There is no change stream to close')
  }
}
