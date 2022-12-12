function generateInt (min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * ((maxFloored - minCeiled) + 1)) + minCeiled
}

// Set env
const port = generateInt(3000, 4000)
process.env.PORT = `${port}`
process.env.LOGGING_LEVEL = 'debug'
process.env.MONGO_HOSTS = 'localhost'
process.env.MONGO_DATABASE = 'converge-exercise_test-db'
process.env.MONGO_USERNAME = 'user'
process.env.MONGO_PASSWORD = 'userpassword'
process.env.MONGO_RESOURCE_NAME = 'sensor-data'

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
