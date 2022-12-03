import { logger } from '@converge-exercise/logger'
import { AppError, listenToErrorEvents, handleError } from '@converge-exercise/error-handling'

logger.info('sensor-data service')
logger.info('AppError', AppError)
logger.info('listenToErrorEvents', listenToErrorEvents)
logger.info('handleError', handleError)
