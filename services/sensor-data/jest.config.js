const baseConfig = require('../../jest.config')

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [
    './jest.setup'
  ],
  globalSetup: './src/routes/__tests__/__utils__/global-setup.ts',
  globalTeardown: './src/routes/__tests__/__utils__/global-teardown.ts',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.dist/',
    './src/routes/__tests__/__utils__/*'
  ]
}
