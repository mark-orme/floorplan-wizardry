
// Vitest/Jest setup file
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom'; // Add this import for DOM matchers

// Mock window properties
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Configure intersection observer
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockImplementation((callback) => {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  };
});
window.IntersectionObserver = mockIntersectionObserver;

// Configure global fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(''),
});

// Configure canvas mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Mock canvas methods
const mockCanvasContext = {
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  arc: vi.fn(),
  setTransform: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 10 }),
  setLineDash: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
};

// Properly type the mock function
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => {
  return mockCanvasContext as unknown as CanvasRenderingContext2D;
});

// Add expect to globalThis for test
if (typeof globalThis.expect === 'undefined') {
  // Safe assignment that works with TypeScript
  (globalThis as any).expect = expect;
}

// Mock local storage
class MockLocalStorage {
  private store: Record<string, string>;
  
  constructor() {
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

  clear() {
    this.store = {};
  }
  
  // Implement required Storage interface methods
  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
  
  get length(): number {
    return Object.keys(this.store).length;
  }
}

global.localStorage = new MockLocalStorage() as unknown as Storage;

// Export mock functions for test use
export {
  expect,
  MockLocalStorage,
};
