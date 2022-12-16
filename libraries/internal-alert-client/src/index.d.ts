import { Response } from 'node-fetch'

declare module '@changestream-poc/internal-alert-client' {
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
    private readonly url
    constructor (url: string)
    static checkResStatus (res: Response): Response
    sendAlert (alertData: InternalAlertData): Promise<string>
  }
}
