/**
 * Pure-logic unit tests. We deliberately avoid `jest-expo` / React Native
 * test renderers — the goal is fast feedback on utilities, stores, and api
 * serializers, not component rendering. `testEnvironment: 'node'` keeps the
 * runner lean; any suite that needs a DOM can opt in locally.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Native-only modules; the jest runtime is Node, so stub what we touch
    // transitively from API/store code.
    '^expo-secure-store$': '<rootDir>/src/__mocks__/expo-secure-store.ts',
    '^expo-constants$': '<rootDir>/src/__mocks__/expo-constants.ts',
    '^react-native$': '<rootDir>/src/__mocks__/react-native.ts',
  },
  // React Native's transform chain isn't needed — we only run plain TS.
  transformIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/lib/**/*.ts', 'src/store/**/*.ts', 'src/api/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'lcov'],
};
