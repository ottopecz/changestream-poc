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
process.env.MONGO_DATABASE = 'ce-notification-test-db'
process.env.MONGO_COLLECTION = 'notifications'
process.env.MONGO_USERNAME = 'user'
process.env.MONGO_PASSWORD = 'userpassword'
process.env.MONGO_RESOURCE_NAME = process.env.MONGO_COLLECTION
process.env.EXT_ALERT_PROVIDER_URL = 'https://devnull-as-a-service.com/dev/null'

// Mock logger package
jest.mock('@converge-exercise/logger')
