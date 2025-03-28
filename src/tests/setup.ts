
/**
 * Test setup and configuration
 * Sets up test environment with mocks for fabric, canvas, and other dependencies
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with testing-library matchers
vi.stubGlobal('expect', expect);
expect.extend(matchers);

// Mock for Canvas RenderingContext
interface CanvasRenderingContext2DMock {
  fillRect: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  getImageData: ReturnType<typeof vi.fn>;
  putImageData: ReturnType<typeof vi.fn>;
  createImageData: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  drawImage: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  closePath: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn>;
  [key: string]: any;
}

// Create Canvas Context Mock
const createCanvasContextMock = () => {
  const mock: CanvasRenderingContext2DMock = {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({
      width: 0,
      height: 0,
      data: new Uint8ClampedArray(),
      colorSpace: 'srgb'
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({
      width: 0,
      height: 0,
      data: new Uint8ClampedArray(),
      colorSpace: 'srgb'
    })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    canvas: {
      width: 100,
      height: 100
    },
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    createPattern: vi.fn(),
    createConicGradient: vi.fn(() => ({
      addColorStop: vi.fn()
    })),
    getTransform: vi.fn(),
    resetTransform: vi.fn(),
    drawFocusIfNeeded: vi.fn(),
    getContextAttributes: vi.fn(),
    getLineDash: vi.fn(() => []),
    setLineDash: vi.fn(),
    clip: vi.fn(),
    isPointInPath: vi.fn(),
    isPointInStroke: vi.fn()
  };

  // Add additional properties with default mock implementations
  Object.defineProperties(mock, {
    fillStyle: { get: vi.fn(), set: vi.fn() },
    strokeStyle: { get: vi.fn(), set: vi.fn() },
    lineWidth: { get: vi.fn(), set: vi.fn() },
    lineCap: { get: vi.fn(), set: vi.fn() },
    lineJoin: { get: vi.fn(), set: vi.fn() },
    miterLimit: { get: vi.fn(), set: vi.fn() },
    font: { get: vi.fn(), set: vi.fn() },
    textAlign: { get: vi.fn(), set: vi.fn() },
    textBaseline: { get: vi.fn(), set: vi.fn() },
    direction: { get: vi.fn(), set: vi.fn() },
    globalAlpha: { get: vi.fn(), set: vi.fn() },
    globalCompositeOperation: { get: vi.fn(), set: vi.fn() },
    imageSmoothingEnabled: { get: vi.fn(), set: vi.fn() },
    imageSmoothingQuality: { get: vi.fn(), set: vi.fn() }
  });

  return mock;
};

// Mock HTMLCanvasElement
class HTMLCanvasElementMock {
  width = 100;
  height = 100;
  
  getContext(contextType: string) {
    return createCanvasContextMock();
  }
  
  toDataURL() {
    return '';
  }
  
  toBlob(callback: (blob: Blob | null) => void) {
    callback(new Blob());
  }
  
  transferControlToOffscreen() {
    throw new Error('Not implemented in mock');
  }
  
  captureStream() {
    throw new Error('Not implemented in mock');
  }
}

// Add our custom implementations to the global object
const getContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function mockGetContext(contextId: string) {
  if (contextId === '2d') {
    return createCanvasContextMock();
  }
  // Fall back to original implementation for other context types
  return getContext.call(this, contextId);
};

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Add custom matchers
expect.extend({
  toHaveCanvasSize(received: HTMLCanvasElement, width: number, height: number) {
    const pass = received.width === width && received.height === height;
    if (pass) {
      return {
        message: () =>
          `expected canvas not to have dimensions ${width}x${height}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected canvas to have dimensions ${width}x${height}, but got ${received.width}x${received.height}`,
        pass: false,
      };
    }
  }
});

// Extend global mocks
global.ResizeObserver = ResizeObserverMock as any;
global.IntersectionObserver = IntersectionObserverMock as any;

// Define a global requestAnimationFrame mock
global.requestAnimationFrame = (callback: FrameRequestCallback) => {
  return setTimeout(() => callback(Date.now()), 0);
};

global.cancelAnimationFrame = (handle: number) => {
  clearTimeout(handle);
};

// Mock media queries
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

// Make sure tests import this file to get the extensions
export {};
