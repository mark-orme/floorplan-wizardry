
/**
 * Test setup file
 * Configures global test environment
 * @module tests/setup
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Canvas } from 'fabric';
import type { MockCanvas } from '@/utils/test/createMockCanvas';

// Define fabric related interfaces
interface FabricMock {
  Canvas: typeof Canvas;
}

// Mock the fabric module
vi.mock('fabric', () => {
  const mockCanvas: Partial<MockCanvas> = {
    on: vi.fn(),
    off: vi.fn(),
    add: vi.fn(),
    remove: vi.fn(),
    getObjects: vi.fn().mockReturnValue([]),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    getActiveObjects: vi.fn().mockReturnValue([]),
    discardActiveObject: vi.fn(),
    contains: vi.fn().mockReturnValue(false),
    withImplementation: vi.fn().mockImplementation((callback?: Function): Promise<void> => {
      if (callback && typeof callback === 'function') {
        try {
          const result = callback();
          if (result instanceof Promise) {
            return result.then(() => Promise.resolve());
          }
        } catch (error) {
          console.error('Error in withImplementation mock:', error);
        }
      }
      return Promise.resolve();
    })
  };
  
  // Mock constructor
  const CanvasMock = vi.fn().mockImplementation(() => mockCanvas);
  
  // Mock fabric module
  return {
    Canvas: CanvasMock,
    Line: vi.fn().mockImplementation(() => ({})),
    Rect: vi.fn().mockImplementation(() => ({})),
    Circle: vi.fn().mockImplementation(() => ({}))
  } as FabricMock;
});

// Window mock setup
interface ExtendedWindow extends Window {
  ResizeObserver: typeof ResizeObserver;
  matchMedia: (query: string) => MediaQueryList;
}

// Mock ResizeObserver
class ResizeObserverMock implements ResizeObserver {
  callback: ResizeObserverCallback;
  
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  
  observe(): void {
    // No-op for testing
  }
  
  unobserve(): void {
    // No-op for testing
  }
  
  disconnect(): void {
    // No-op for testing
  }
}

// Mock matchMedia
const mockMatchMedia = (query: string): MediaQueryList => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  };
};

// Apply global mocks
(global.window as ExtendedWindow).ResizeObserver = ResizeObserverMock;
(global.window as ExtendedWindow).matchMedia = mockMatchMedia;
