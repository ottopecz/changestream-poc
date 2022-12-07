import AWSXRay, { Segment, Subsegment } from 'aws-xray-sdk'
import type { Request, Response, NextFunction } from 'express'

function xrayEnvironmentAnnotation (annotations: { [p: string]: unknown }) {
  return function xrayEnvironmentAnnotation (req: Request, res: Response, next: NextFunction) {
    const segment: Segment | Subsegment | undefined = AWSXRay.getSegment()
    Object.entries(annotations).forEach(([key, value]) => {
      if ((segment != null) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        segment.addAnnotation(key, value)
      }
    })
    next()
  }
}

export default xrayEnvironmentAnnotation
