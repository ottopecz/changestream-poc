import { ChangeStream, Db, ChangeStreamDocument } from 'mongodb'
import { logger, mongoDBDriver, alertClient } from './singletons'
import { config, configProvider } from './config'

const { mongo: { collection } } = configProvider(config)

let changeStream: ChangeStream

function sensorAlertDataFactory ({
  sensorId,
  time,
  value
}: {
  sensorId: string
  time: number
  value: number
}): { text: string } {
  const dateTime = new Date(time)
  return {
    text: `The sensor with with id: ${sensorId} showed critical value of: ${value} at ${dateTime.toDateString()}`
  }
}

const alertFactories = new Map([['sensor', sensorAlertDataFactory]])

export async function changeHandler (changeStreamDocument: ChangeStreamDocument): Promise<void> {
  if (changeStreamDocument.operationType !== 'insert') {
    logger.info('Dropping document', { operationType: changeStreamDocument.operationType })
    return // dropping change gracefully
  }

  const { fullDocument: { type, context: { type: alertType, context: { reading } } } } = changeStreamDocument
  const alertFactory = alertFactories.get(alertType)
  if (alertFactory !== undefined) {
    const alertData = alertFactory(reading)
    logger.info('Sending external alert request', { type, reading })
    await alertClient.sendAlert(alertData)
    return
  }
  throw new Error(`No available alert factory for alert type: ${type as string}`)
}

export default {
  async listen (): Promise<ChangeStream> {
    const db: Db = await mongoDBDriver.getDb()
    const coll = db.collection(collection)
    changeStream = coll.watch([], { fullDocument: 'updateLookup' })
    changeStream.on('change', changeHandler) // eslint-disable-line @typescript-eslint/no-misused-promises
    logger.info('The change stream is opened')
    return changeStream
  },

  async close (): Promise<void> {
    await changeStream.close()
    logger.info('The change stream is closed')
  }
}
