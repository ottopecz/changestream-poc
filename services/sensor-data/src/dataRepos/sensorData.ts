import type { DataRepo } from './types'

export interface SensorDataType {
  sensorId: string
  time: number
  value: number
}

interface DBSensorDataType extends SensorDataType {
  _id: unknown
}

export interface SensorQueryType {
  sensorId: string
  since: number
  until: number
}

interface DBdriverType {
  createOne: ({ collection, doc }: {
    collection: string
    doc: SensorDataType
  }) => Promise<unknown>
  read: ({ collection, query }: {
    collection: string
    query: SensorQueryType
  }) => Promise<DBSensorDataType[]>
}

export class SensorDataRepo implements DataRepo<SensorDataType, SensorQueryType> {
  private readonly resourceName: string
  private readonly dbDriver: DBdriverType

  constructor ({ resourceName, dbDriver }: { resourceName: string, dbDriver: DBdriverType }) {
    this.resourceName = resourceName
    this.dbDriver = dbDriver
  }

  async add (sensorData: SensorDataType): Promise<unknown> {
    return await this.dbDriver.createOne({ collection: this.resourceName, doc: sensorData })
  }

  async fetch (query: SensorQueryType): Promise<SensorDataType[]> {
    const records = await this.dbDriver.read({ collection: this.resourceName, query })

    return records.map((record: DBSensorDataType) => {
      const clone = { ...record }
      delete clone._id
      return clone
    })
  }
}
