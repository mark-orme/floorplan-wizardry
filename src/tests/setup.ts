
/**
 * Test Setup File
 * Configures the test environment and global mocks
 * @module tests/setup
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock setTimeout globally
window.setTimeout = vi.fn().mockImplementation((cb, ms) => {
  if (typeof cb === 'function') cb();
  return 123 as unknown as NodeJS.Timeout;
});

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
  };
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

// Add missing jest-dom matchers
expect.extend({
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

// Setup global test utilities
global.afterEach(() => {
  vi.clearAllMocks();
});
