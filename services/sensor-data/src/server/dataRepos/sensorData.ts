import { ConflictError } from '@converge-exercise/errors'
import type { SensorDataType } from '../../sharedTypes'
import type { DataRepo } from './types'

interface DBSensorDataType extends SensorDataType {
  _id: unknown
}

interface DBErrorType {
  origError: {
    code: number
    message: string
  }
}

export interface SensorDataQueryType {
  sensorId: string
  since: number
  until: number
}

export interface SensorDataDBQueryType {
  sensorId: string
  time: { $gte: number, $lte: number }
}

export interface SensorDataDBdriverType {
  createOne: ({ collection, doc }: {
    collection: string
    doc: SensorDataType
  }) => Promise<unknown>
  read: ({ collection, query }: {
    collection: string
    query: SensorDataDBQueryType
  }) => Promise<DBSensorDataType[]>
}

export class SensorDataRepo implements DataRepo<SensorDataType, SensorDataQueryType> {
  private readonly resourceName: string
  private readonly dbDriver: SensorDataDBdriverType

  constructor ({ resourceName, dbDriver }: { resourceName: string, dbDriver: SensorDataDBdriverType }) {
    this.resourceName = resourceName
    this.dbDriver = dbDriver
  }

  async add (sensorData: SensorDataType): Promise<unknown> {
    let result
    try {
      result = await this.dbDriver.createOne({ collection: this.resourceName, doc: sensorData })
    } catch (err) {
      const { origError: { code, message } }: DBErrorType = err as DBErrorType
      if (code === 11000 && message.includes('duplicate key')) {
        throw new ConflictError('A conflict occurred adding Sensor Data record', {
          origError: err as Error,
          context: { sensorData }
        })
      }
      throw err
    }
    return result
  }

  async fetch (query: SensorDataQueryType): Promise<SensorDataType[]> {
    const { sensorId, since, until } = query
    const dbQuery: SensorDataDBQueryType = { sensorId, time: { $gte: since, $lte: until } }
    const records = await this.dbDriver.read({ collection: this.resourceName, query: dbQuery })

    return records.map((record: DBSensorDataType) => {
      const clone = { ...record }
      delete clone._id
      return clone
    })
  }
}
