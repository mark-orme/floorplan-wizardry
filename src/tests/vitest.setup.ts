
import '@testing-library/jest-dom';

// Conditionally load axe testing utilities
try {
  const { toHaveNoViolations } = require('jest-axe');
  expect.extend(toHaveNoViolations);
  console.log('Loaded jest-axe accessibility testing extensions');
} catch (error) {
  console.warn('jest-axe not available, accessibility tests will be limited');
}

// Add global test environment setup
beforeAll(() => {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
