const baseConfig = require('../../jest.config.js')

module.exports = {
  ...baseConfig,
  globalSetup: './src/__tests__/__utils__/global-setup.ts',
  globalTeardown: './src/__tests__/__utils__/global-teardown.ts',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.dist/',
    './src/__tests__/__utils__/global-setup.ts',
    './src/__tests__/__utils__/global-teardown.ts',
    './src/__tests__/__utils__/mongo-init.js'
  ]
}
