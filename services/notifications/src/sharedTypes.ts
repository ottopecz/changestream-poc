export interface SensorAlertNotificationContext {
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

export interface AlertNotificationContext<T> {
  type: 'sensor'
  context: T
}

export interface NotificationData<T> {
  type: 'alert'
  context: T
}
