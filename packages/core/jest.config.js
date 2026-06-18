/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  // lodash-es ships ESM only, which Jest cannot transform out of node_modules.
  // Map it to the CJS lodash build (identical API) for tests; the rollup build
  // still bundles lodash-es for the published packages.
  moduleNameMapper: {
    '^lodash-es$': 'lodash'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/__tests__/**',
    '!**/node_modules/**',
    '!**/coverage/**'
  ]
};
