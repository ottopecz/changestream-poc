import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'
import responseTime from 'response-time'
import { Request, Response, RequestHandler } from 'express'

export interface Logger {
  debug: (message: string, data: unknown) => void
  info: (message: string) => void
  warn: (message: string, error: unknown) => void
}

export interface CloudwatchConfig {
  metricNames: { [p: string]: string }
  namespace: string
  region: string
}

export async function putResponseTime ({
  cloudwatch,
  clusterName,
  logger,
  metricName,
  namespace,
  serviceName,
  time
}: {
  cloudwatch: CloudWatchClient
  clusterName: string
  logger: Logger
  metricName: string
  namespace: string
  serviceName: string
  time: number
}): Promise<void> {
  logger.info(`cloudwatchResponseTimeMonitoring.putResponseTime: ${time}`)

  const params = {
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

  logger.debug('cloudwatchResponseTimeMonitoring.putResponseTime: Putting metric data', params)

  const putMetricDataCommand = new PutMetricDataCommand(params)
  try {
    const response = await cloudwatch.send(putMetricDataCommand)
    logger.debug('cloudwatchResponseTimeMonitoring.putResponseTime: Response', response)
  } catch (error) {
    logger.warn('cloudwatchResponseTimeMonitoring.putResponseTime: Error putting metric data', error)
  }
}

function cloudwatchResponseTimeMonitoring ({
  cloudWatch,
  logger,
  clusterName,
  serviceName
}: {
  cloudWatch: CloudwatchConfig
  logger: Logger
  clusterName: string
  serviceName: string
}): RequestHandler {
  const { metricNames: { responseTime: metricName }, namespace, region } = cloudWatch

  const cloudwatchClient = new CloudWatchClient({ region })
  return responseTime(async (req: Request, res: Response, time: number) =>
    await putResponseTime({
      cloudwatch: cloudwatchClient,
      logger,
      clusterName,
      metricName,
      namespace,
      serviceName,
      time
    })
  )
}

export default cloudwatchResponseTimeMonitoring
