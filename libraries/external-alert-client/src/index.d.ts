import { Response } from 'node-fetch'

declare module '@converge-exercise/external-alert-client' {
  export interface ExternalAlertData {
    text: string
  }

  export default class ExternalAlertClient {
    private readonly url
    constructor (url: string)
    static checkResStatus (res: Response): Response
    sendAlert (alertData: AlertData): Promise<string>
  }
}
