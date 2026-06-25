module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@utils-types$': '<rootDir>/src/utils/types.ts',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
