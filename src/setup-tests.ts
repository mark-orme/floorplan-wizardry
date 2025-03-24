
// This file will be executed before each test file runs
// It sets up the global Jest test environment without modifying tsconfig

// If Jest globals aren't detected properly, we explicitly declare them here
// This prevents TypeScript errors without needing to modify tsconfig.json
declare global {
  // Jest testing functions
  const describe: jest.Describe;
  const test: jest.It;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
}

// Create a stub for Node.js process if running in browser environment
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = {
    env: {
      NODE_ENV: 'test'
    }
  };
}

export {};
