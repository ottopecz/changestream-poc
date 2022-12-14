const nock = require('nock')

// Block all network requests except supertest calls
nock.disableNetConnect()
nock.enableNetConnect('127.0.0.1')
