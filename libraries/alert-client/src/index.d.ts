import { Response } from 'node-fetch'

declare module '@converge-exercise/alert-client' {
  export interface AlertData {
    level: string
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

  export default class AlertClient {
    private readonly url
    constructor (url: string)
    static checkResStatus (res: Response): Response
    sendAlert (alertData: AlertData): Promise<string>
  }
}
