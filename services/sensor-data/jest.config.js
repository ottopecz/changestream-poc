const baseConfig = require('../../jest.config')

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [
    './jest.setup'
  ],
  globalSetup: './src/__utils__/global-setup.ts',
  globalTeardown: './src/__utils__/global-teardown.ts',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.dist/',
    '/src/__utils__/*'
  ]
}
