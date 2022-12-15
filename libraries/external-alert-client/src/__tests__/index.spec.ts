import nock from 'nock'
import fetch from 'node-fetch'
import { IOError } from '@converge-exercise/errors'
import ExternalAlertClient, { ExternalAlertData } from '../'

jest.mock('node-fetch', () => {
  const origModule = jest.requireActual('node-fetch')
  origModule.default = jest.fn(origModule.default)
  return origModule
})

const mockFetch = fetch as unknown as jest.Mock
const mockExternalAlertData: ExternalAlertData = {
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
}

describe('THE external alert client instance', () => {
  let externalAlertClient: ExternalAlertClient

  beforeEach(() => {
    externalAlertClient = new ExternalAlertClient('http://foo.com/bar')
  })

  afterEach(() => mockFetch.mockClear())

  describe('THE sendMessage method', () => {
    describe('WHEN the underlying library throws', () => {
      beforeEach(() => {
        mockFetch.mockImplementationOnce(() => { throw new Error('test') })
      })

      it('SHOULD throw', async () => {
        return await expect(async () =>
          await externalAlertClient.sendAlert(mockExternalAlertData)).rejects.toThrow(new IOError('An error occurred sending external alert', { origError: new Error('test') }))
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
            await externalAlertClient.sendAlert(mockExternalAlertData))
            .rejects
            .toThrow(new IOError('An error occurred sending external alert', { origError: new Error('statusText: Internal server error, statusCode: 500') }))
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
          const result = await externalAlertClient.sendAlert(mockExternalAlertData)
          expect(fetch).toBeCalledTimes(1)
          expect(fetch).toBeCalledWith('http://foo.com/bar', { body: JSON.stringify(mockExternalAlertData), method: 'PUT' })
          expect(result).toBe('')
        })
      })
    })
  })
})
