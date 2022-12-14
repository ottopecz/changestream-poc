import { Response } from 'node-fetch'

declare module '@converge-exercise/alert-client' {
  export interface AlertData {
    sensorId: string
    value: number
    time: number
  }

  export default class AlertClient {
    private readonly url
    constructor (url: string)
    static checkResStatus (res: Response): Response
    sendAlert (alertData: AlertData): Promise<string>
  }
}
