import nock from 'nock'
import fetch from 'node-fetch'
import { IOError } from '@converge-exercise/errors'
import AlertClient, { AlertData } from '../'

jest.mock('node-fetch', () => {
  const origModule = jest.requireActual('node-fetch')
  origModule.default = jest.fn(origModule.default)
  return origModule
})

const mockFetch = fetch as unknown as jest.Mock
const mockAlertData: AlertData = {
  level: 'severe',
  context: {
    reading: {
      sensorId: 'a6620c91-c855-4a16-a9a2-779861f93714',
      time: 1670682969883,
      value: 6.2
    },
    validRange: {
      from: 5,
      to: 6
    }
  }
}

describe('THE alertClient instance', () => {
  let alertClient: AlertClient

  beforeEach(() => {
    alertClient = new AlertClient('http://foo.com/bar')
  })

  afterEach(() => mockFetch.mockClear())

  describe('THE sendMessage method', () => {
    describe('WHEN the underlying library throws', () => {
      beforeEach(() => {
        mockFetch.mockImplementationOnce(() => { throw new Error('test') })
      })

      it('SHOULD throw', async () => {
        return await expect(async () =>
          await alertClient.sendAlert(mockAlertData)).rejects.toThrow(new IOError('An error occurred sending alert', { origError: new Error('test') }))
      })
    })

    describe('WHEN the underlying library succeeds', () => {
      describe('AND the status of the response is other than 2XX', () => {
        beforeEach(() => {
          nock('http://foo.com')
            .put('/bar')
            .reply(500, 'Internal server error')
        })

        it('SHOULD throw', async () => {
          return await expect(async () =>
            await alertClient.sendAlert(mockAlertData))
            .rejects
            .toThrow(new IOError('An error occurred sending alert', { origError: new Error('statusText: Internal server error, statusCode: 500') }))
        })
      })

      describe('AND the status of the response is 2XX', () => {
        beforeEach(() => {
          nock('http://foo.com')
            .put('/bar')
            .reply(204, '')
        })

        it('SHOULD Call the node-fetch library ' +
          'AND return the text of the response', async () => {
          const result = await alertClient.sendAlert(mockAlertData)
          expect(fetch).toBeCalledTimes(1)
          expect(fetch).toBeCalledWith('http://foo.com/bar', { body: JSON.stringify(mockAlertData), method: 'PUT' })
          expect(result).toBe('')
        })
      })
    })
  })
})
