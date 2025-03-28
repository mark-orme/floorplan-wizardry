
/**
 * Test setup file
 * Configures the test environment with mocks and globals
 */
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock canvas and context
const createMockCanvas = () => {
  const canvas = document.createElement('canvas');

  // Define colorSpace for newer browser API compatibility
  const ctx = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
      colorSpace: 'srgb' // Add colorSpace property for newer API
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
      colorSpace: 'srgb' // Add colorSpace property for newer API
    })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    rect: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    setLineDash: vi.fn(),
    getLineDash: vi.fn(() => []),
    createPattern: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    isPointInPath: vi.fn(() => false),
    isPointInStroke: vi.fn(() => false),
    clip: vi.fn(),
    ellipse: vi.fn(),
    getContextAttributes: vi.fn(() => ({}))
  };

  canvas.getContext = vi.fn(() => ctx);
  
  return {
    canvas,
    ctx
  };
};

/**
 * Enhanced mock for HTMLCanvasElement
 */
class HTMLCanvasElementMock extends HTMLElement {
  constructor() {
    super();
    this.width = 300;
    this.height = 150;
  }
  
  getContext(contextType: string) {
    // Return a minimal Canvas context mock with required methods
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(),
        width: 0,
        height: 0,
        colorSpace: 'srgb'
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(),
        width: 0,
        height: 0,
        colorSpace: 'srgb'
      })),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      closePath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      getContextAttributes: vi.fn(() => ({}))
    };
  }
  
  // Canvas API methods
  toDataURL() {
    return '';
  }
  
  toBlob(callback: (blob: Blob | null) => void) {
    callback(null);
  }
  
  width: number;
  height: number;
}

// Mock requestAnimationFrame
window.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now())) as unknown as number;
};

// Mock cancelAnimationFrame
window.cancelAnimationFrame = (handle: number): void => {
  clearTimeout(handle);
};

// Setup global mocks before tests run
beforeAll(() => {
  // Define properties in global for window/document
  Object.defineProperty(global, 'ResizeObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))
  });

  // Mock HTMLCanvasElement
  window.HTMLCanvasElement.prototype.getContext = function() {
    return createMockCanvas().ctx;
  };
  
  // Mock DOMRect
  window.DOMRect = class DOMRect {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
    
    toJSON() {
      return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
  };
});

// Clean up mocks after tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Export mocks for use in tests
export { createMockCanvas, HTMLCanvasElementMock };
