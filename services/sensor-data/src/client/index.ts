import { ChangeStream, Db, ChangeStreamDocument } from 'mongodb'
import { logger, mongoDBDriver, alertClient } from './singletons'
import { InternalAlertData } from '@converge-exercise/internal-alert-client'
import { config, configProvider } from './config'

const { mongo: { collection }, sensorData: { from, to } } = configProvider(config)

let changeStream: ChangeStream

function sensorAlertDataFactory ({
  sensorId,
  time,
  value,
  from,
  to
}: {
  sensorId: string
  time: number
  value: number
  from: number
  to: number
}): InternalAlertData {
  return {
    type: 'sensor',
    context: {
      reading: {
        sensorId,
        time,
        value
      },
      validRange: {
        from,
        to
      }
    }
  }
}

export async function changeHandler (changeStreamDocument: ChangeStreamDocument): Promise<void> {
  if (changeStreamDocument.operationType !== 'insert') {
    logger.info('Dropping document', { operationType: changeStreamDocument.operationType })
    return // dropping change gracefully
  }

  const { fullDocument: { sensorId, value, time } } = changeStreamDocument

  if (value < from || value > to) {
    logger.info('Sending alert request', { sensorId, value, time })
    const internalAlertData = sensorAlertDataFactory({ sensorId, value, time, from, to })
    await alertClient.sendAlert(internalAlertData)
  }
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
