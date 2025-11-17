module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test/unit'],
  testMatch: [
    '**/*.jest.test.js'
  ],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 10000,
  verbose: true
};
