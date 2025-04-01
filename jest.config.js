
/**
 * Jest configuration
 * Configures testing framework
 */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    '^@/(.*)$': '<rootDir>/src/$1',
    
    // Handle CSS imports (with CSS modules)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    
    // Handle CSS imports (without CSS modules)
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    
    // Handle static assets
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest', { 
      tsconfig: 'tsconfig.json',
      isolatedModules: true 
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$'
  ]
};
