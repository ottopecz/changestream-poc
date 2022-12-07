import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'
import responseTime from 'response-time'

import cloudwatchResponseTimeMonitoring, { putResponseTime, CloudwatchConfig, Logger } from '../cloudwatchResponseTimeMonitoring'

jest.mock('response-time', () => jest.fn().mockImplementation((callback) => callback))
jest.mock('@aws-sdk/client-cloudwatch')

const MockedCloudWatchClient: jest.Mock = CloudWatchClient as jest.Mock<CloudWatchClient>

describe('THE \'cloudwatchResponseTimeMonitoring\' middleware', () => {
  let cloudWatch: CloudwatchConfig
  let clusterName: string
  let serviceName: string
  let logger: Logger

  beforeEach(() => {
    serviceName = 'foo'
    cloudWatch = {
      metricNames: { responseTime: 'bar' },
      namespace: 'qux',
      region: 'corge'
    }
    clusterName = 'baz'
    logger = {
      debug () {},
      info () {},
      warn () {}
    }
  })

  describe('THE middleware', () => {
    describe('WHEN instantiated', () => {
      describe('AND all required params are supplied', () => {
        it('SHOULD have instantiated the CloudWatch client ' +
          'AND returned the result of calling the \'response-time\' middleware', () => {
          const middleware = cloudwatchResponseTimeMonitoring({
            cloudWatch,
            clusterName,
            logger,
            serviceName
          })
          expect(CloudWatchClient).toHaveBeenCalled()
          expect(responseTime).toHaveBeenCalledWith(expect.any(Function))
          expect(middleware).toEqual(expect.any(Function))
        })
      })
    })
  })

  describe('THE \'putResponseTime\' utility', () => {
    const time = 1
    let metricName: string
    let namespace: string
    let args: {
      cloudwatch: CloudWatchClient
      clusterName: string
      logger: Logger
      metricName: string
      namespace: string
      serviceName: string
      time: number
    }
    let expectedArgsPutMetricData: { [p: string]: unknown }

    beforeEach(() => {
      metricName = cloudWatch.metricNames.responseTime
      namespace = cloudWatch.namespace
      const cloudwatchClient = new CloudWatchClient({ region: cloudWatch.region })
      args = { cloudwatch: cloudwatchClient, clusterName, logger, metricName, namespace, serviceName, time }
      expectedArgsPutMetricData = {
        MetricData: [{
          MetricName: metricName,
          Dimensions: [
            { Name: 'ClusterName', Value: clusterName },
            { Name: 'ServiceName', Value: serviceName }
          ],
          Unit: 'Milliseconds',
          Value: time
        }],
        Namespace: namespace
      }

      MockedCloudWatchClient.prototype.send.mockClear()
    })

    describe('WHEN there is an error when calling putMetricData', () => {
      beforeEach(() => {
        MockedCloudWatchClient.prototype.send.mockImplementation(() => { throw new Error('mock error') })
      })

      it('SHOULD not throw', async () => {
        await putResponseTime(args)
        expect(PutMetricDataCommand).toHaveBeenCalledWith(expectedArgsPutMetricData)
        expect(MockedCloudWatchClient.prototype.send).toBeCalledTimes(1)
        expect(MockedCloudWatchClient.prototype.send.mock.calls[0][0]).toBeInstanceOf(
          PutMetricDataCommand
        )
      })
    })

    describe('WHEN putMetricData returns successfully', () => {
      beforeEach(() => {
        MockedCloudWatchClient.prototype.send.mockImplementation(async () => await Promise.resolve())
      })

      it('SHOULD return nothing', async () => {
        await putResponseTime(args)
        expect(PutMetricDataCommand).toHaveBeenCalledWith(expectedArgsPutMetricData)
        expect(MockedCloudWatchClient.prototype.send).toBeCalledTimes(1)
        expect(MockedCloudWatchClient.prototype.send.mock.calls[0][0]).toBeInstanceOf(
          PutMetricDataCommand
        )
      })
    })
  })
})
