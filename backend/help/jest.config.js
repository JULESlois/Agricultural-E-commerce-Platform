/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    collectCoverage: true,
    coverageProvider: 'v8',
    roots: ['<rootDir>'],                 // 只测试当前目录
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/*.test.js',
        '**/*.spec.js'
    ],
    setupFiles: ['dotenv/config'],        // 自动加载 .env
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        'services/**/*.js',
        '!**/node_modules/**'
    ]
};