/**
 * Test Setup File
 * Configures the test environment and global mocks
 * @module tests/setup
 */
import '@testing-library/jest-dom';
import { vi, expect as vitestExpect } from 'vitest';

// Define types for mocked timers with __promisify__ property
interface MockedSetTimeout extends Function {
  __promisify__: Function;
}

// Mock setTimeout globally
const mockedSetTimeout = vi.fn().mockImplementation((cb, ms) => {
  if (typeof cb === 'function') cb();
  return 123 as unknown as NodeJS.Timeout;
});

// Add required __promisify__ property to the mock function
(mockedSetTimeout as unknown as MockedSetTimeout).__promisify__ = vi.fn();

// Apply the mock
window.setTimeout = mockedSetTimeout as unknown as typeof window.setTimeout;

// Mock canvas
window.HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  strokeRect: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  putImageData: vi.fn(),
  getImageData: vi.fn().mockReturnValue({
    data: new Uint8ClampedArray(4)
  }),
  fillText: vi.fn(),
  setLineDash: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({
    addColorStop: vi.fn()
  }),
  createPattern: vi.fn()
});

// Mock MutationObserver if not available
if (!global.MutationObserver) {
  global.MutationObserver = class MutationObserver {
    constructor(callback: Function) {}
    disconnect() {}
    observe(element: Node, initObject: MutationObserverInit) {}
    takeRecords() { return []; } // Add the missing takeRecords method
  } as unknown as typeof MutationObserver;
}

// Mock ResizeObserver if not available
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback: Function) {}
    disconnect() {}
    observe(element: Element, options?: ResizeObserverOptions) {}
    unobserve(element: Element) {}
  };
}

// Mock IntersectionObserver if not available
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback: Function, options?: IntersectionObserverInit) {}
    disconnect() {}
    observe(element: Element) {}
    unobserve(element: Element) {}
    root = null;
    rootMargin = '';
    thresholds: number[] = [];
    takeRecords() { return []; }
  };
}

// Mock performance.now if not available
if (!window.performance || !window.performance.now) {
  window.performance = {
    ...window.performance,
    now: () => Date.now()
  };
}

// Define global.expect for test extensions if it doesn't exist
if (typeof global.expect === 'undefined') {
  // This is a fallback if expect is not available in the global scope
  // In a real setup, you'd be using jest.expect or another test framework
  global.expect = (actual: any) => ({
    toBe: (expected: any) => actual === expected,
    toEqual: (expected: any) => JSON.stringify(actual) === JSON.stringify(expected),
    // Add other matchers as needed
  });
} else {
  // Extension methods for existing expect
  vitestExpect.extend({
    toBeInTheDocument(received) {
      const pass = Boolean(received);
      return {
        message: () => `expected ${received} ${pass ? 'not ' : ''}to be in the document`,
        pass
      };
    },
    toHaveAttribute(received, name, value) {
      const hasAttribute = received.hasAttribute(name);
      const attributeValue = received.getAttribute(name);
      const pass = value === undefined 
        ? hasAttribute 
        : hasAttribute && attributeValue === value;
      
      return {
        message: () => {
          if (value === undefined) {
            return `expected ${received} ${pass ? 'not ' : ''}to have attribute "${name}"`;
          }
          return `expected ${received} ${pass ? 'not ' : ''}to have attribute "${name}" with value "${value}"`;
        },
        pass
      };
    }
  });
}

// Make Vitest's expect available globally
global.expect = vitestExpect;

// Setup global test utilities
global.afterEach(() => {
  vi.clearAllMocks();
});
