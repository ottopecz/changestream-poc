import { IOError } from '@converge-exercise/errors'
import fetch, { Response } from 'node-fetch'

type InternalAlertTypes = 'sensor'

export interface InternalAlertData {
  type: InternalAlertTypes
  context: {
    reading: {
      sensorId: string
      time: number
      value: number
    }
    validRange: {
      from: number
      to: number
    }
  }
}

export default class InternalAlertClient {
  private readonly url: string

  constructor (url: string) {
    this.url = url
  }

  static checkResStatus (res: Response): Response {
    const { statusText, status: statusCode } = res

    if (res.ok) { // res.status >= 200 && res.status < 300
      return res
    }

    throw new Error(`statusText: ${statusText}, statusCode: ${statusCode}`)
  }

  async sendAlert (alertData: InternalAlertData): Promise<string> {
    let res
    try {
      res = await fetch(this.url, { body: JSON.stringify(alertData), method: 'PUT' })
      InternalAlertClient.checkResStatus(res as unknown as Response)
      return await res.text()
    } catch (err: unknown) {
      const origError = err as Error
      throw new IOError('An error occurred sending alert', { origError })
    }
  }
}
