const baseConfig = require('../../jest.config')

module.exports = {
  ...baseConfig,
  setupFilesAfterEnv: [
    './jest.setup'
  ],
  globalSetup: './src/__testutils__/global-setup.ts',
  globalTeardown: './src/__testutils__/global-teardown.ts',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.dist/',
    '/src/__testutils__/*'
  ]
}
