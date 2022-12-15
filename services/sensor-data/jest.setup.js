function generateInt (min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * ((maxFloored - minCeiled) + 1)) + minCeiled
}

// Set env
const port = generateInt(3000, 4000) // @TODO use port 0 as ephemeral...
process.env.PORT = `${port}`
process.env.LOGGING_LEVEL = 'debug'
process.env.MONGO_HOSTS = 'localhost'
process.env.MONGO_DATABASE = 'converge-exercise_test-db'
process.env.MONGO_COLLECTION = 'sensor-data'
process.env.MONGO_USERNAME = 'user'
process.env.MONGO_PASSWORD = 'userpassword'
process.env.MONGO_RESOURCE_NAME = process.env.MONGO_COLLECTION
process.env.SENSOR_DATA_SINCE = 5
process.env.SENSOR_DATA_UNTIL = 6
process.env.SENSOR_DATA_ALERT_URL = 'https://devnull-as-a-service.com/dev/null'

// Mock logger package
jest.mock('@converge-exercise/logger', () => {
  return class MockLogger {
    debug () {}
    error () {}
    info () {}
    log () {}
    warn () {}
  }
})
