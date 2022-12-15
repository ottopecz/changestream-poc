const baseConfig = require('../../jest.config.js')

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [
    './jest.setup'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.dist/'
  ]
}
