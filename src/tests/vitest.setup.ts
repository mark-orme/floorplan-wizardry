
import '@testing-library/jest-dom';

// Add any global setup logic here
// This file runs before tests are executed

// Setup test environment
window.matchMedia = window.matchMedia || function(query: string) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  };
};

// Mock ResizeObserver
window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
