/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  transformIgnorePatterns: ['/node_modules/(?!lodash-es/)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+/node_modules/lodash-es/.+\\.js$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
      }
    ]
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
    '!**/node_modules/**',
    '!**/coverage/**'
  ]
};
