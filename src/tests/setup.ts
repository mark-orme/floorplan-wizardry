
/**
 * Test setup file
 * Configures the test environment with mocks and globals
 */
import { vi, expect } from 'vitest';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';

// Only extend if not already extended
if (typeof expect.toBeInTheDocument === 'undefined') {
  expect.extend(matchers);
}

// Type for our canvas context mock
interface CanvasRenderingContext2DMock {
  fillRect: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  getImageData: ReturnType<typeof vi.fn>;
  putImageData: ReturnType<typeof vi.fn>;
  createImageData: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  scale: ReturnType<typeof vi.fn>;
  translate: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  closePath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  rect: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn>;
  createLinearGradient: ReturnType<typeof vi.fn>;
  setLineDash: ReturnType<typeof vi.fn>;
  getLineDash: ReturnType<typeof vi.fn>;
  createPattern: ReturnType<typeof vi.fn>;
  bezierCurveTo: ReturnType<typeof vi.fn>;
  quadraticCurveTo: ReturnType<typeof vi.fn>;
  isPointInPath: ReturnType<typeof vi.fn>;
  isPointInStroke: ReturnType<typeof vi.fn>;
  clip: ReturnType<typeof vi.fn>;
  ellipse: ReturnType<typeof vi.fn>;
  getContextAttributes: ReturnType<typeof vi.fn>;
  
  // Add missing canvas properties
  canvas?: HTMLCanvasElement;
  globalAlpha?: number;
  globalCompositeOperation?: string;
  fillStyle?: string;
  strokeStyle?: string;
}

// Mock canvas and context
const createMockCanvas = () => {
  const canvas = document.createElement('canvas');

  // Define colorSpace for newer browser API compatibility
  const ctx: CanvasRenderingContext2DMock = {
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
    getContextAttributes: vi.fn(() => ({})),
    
    // Add required canvas context properties
    canvas: canvas,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    fillStyle: '#000000',
    strokeStyle: '#000000'
  } as any; // Type assertion for compatibility

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
    return createMockCanvas().ctx;
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

  // Mock HTMLCanvasElement getContext
  const origGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextId: string) {
    // For testing purposes, return our mock
    return createMockCanvas().ctx as unknown as CanvasRenderingContext2D;
  };
  
  // Mock DOMRect
  window.DOMRect = class DOMRectMock {
    constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}
    
    toJSON() {
      return { x: this.x, y: this.y, width: this.width, height: this.height };
    }
    
    // Add missing static method
    static fromRect(other?: DOMRectInit): DOMRect {
      return new DOMRect(
        other?.x || 0,
        other?.y || 0,
        other?.width || 0,
        other?.height || 0
      );
    }
  } as unknown as typeof DOMRect;
});

// Clean up mocks after tests
afterAll(() => {
  vi.restoreAllMocks();
});

// Export mocks for use in tests
export { createMockCanvas, HTMLCanvasElementMock };
