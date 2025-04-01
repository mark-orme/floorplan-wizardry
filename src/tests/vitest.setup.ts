
/**
 * Vitest global setup
 * Provides mocks and test utilities
 */
import { vi } from 'vitest';
import { Canvas } from 'fabric';

// Mock fabric.js
vi.mock('fabric', () => {
  const mockedCanvas = vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    renderAll: vi.fn(),
    getWidth: vi.fn().mockReturnValue(800),
    getHeight: vi.fn().mockReturnValue(600),
    getElement: vi.fn().mockReturnValue(document.createElement('canvas')),
    getContext: vi.fn().mockReturnValue({}),
    contains: vi.fn().mockReturnValue(false),
    dispose: vi.fn(),
    clear: vi.fn(),
    isDrawingMode: false,
    selection: true
  }));

  const mockedLine = vi.fn(() => ({
    set: vi.fn().mockReturnThis(),
    setCoords: vi.fn(),
    selectable: true,
    objectType: undefined
  }));

  // Return mocked fabric module
  return {
    Canvas: mockedCanvas,
    Line: mockedLine,
    Point: vi.fn((x, y) => ({ x, y })),
    Object: vi.fn(),
    IText: vi.fn()
  };
});

// Mock window.navigator.keyboard for tests
Object.defineProperty(global.navigator, 'keyboard', {
  value: {
    getLayoutMap: vi.fn().mockResolvedValue(new Map()),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  },
  configurable: true
});

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn()
  }
}));

// Add global mocks
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
}));
