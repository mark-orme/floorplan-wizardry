
/**
 * Setup file for tests
 * @module __tests__/setup
 */

// Import test library extensions
import '@testing-library/jest-dom';

// Set up mocks for browser APIs
if (typeof window !== 'undefined') {
  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() { /* noop */ }
    unobserve() { /* noop */ }
    disconnect() { /* noop */ }
  };

  // Mock window properties
  Object.defineProperty(window, '__app_state', {
    value: {
      drawing: {
        currentTool: 'select',
        lineColor: '#000000',
        lineThickness: 2,
        snapEnabled: true
      }
    },
    writable: true
  });

  Object.defineProperty(window, '__canvas_state', {
    value: {
      width: 800,
      height: 600,
      zoom: 1,
      objectCount: 0,
      gridVisible: true
    },
    writable: true
  });

  // Mock canvas rendering context
  // Use a proper type assertion for TypeScript
  HTMLCanvasElement.prototype.getContext = function() {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Array(4),
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      translate: vi.fn(),
      transform: vi.fn(),
      fillText: vi.fn(),
      strokeRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
    } as unknown as CanvasRenderingContext2D;
  };
}

// Setup localStorage mock
class LocalStorageMock {
  store: Record<string, string>;
  
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number) {
    return Object.keys(this.store)[index] || null;
  }
}

// Apply the localStorage mock
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock(),
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: new LocalStorageMock(),
});
