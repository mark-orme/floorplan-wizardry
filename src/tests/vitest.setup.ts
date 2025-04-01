
/**
 * Setup file for Vitest
 * Establishes global test utilities and mocks
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Make vi available globally for mock functions
(window as any).vi = vi;

// Mock canvas API for tests
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
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
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      fill: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
      createLinearGradient: vi.fn(() => ({
        addColorStop: vi.fn(),
      })),
    };
  } else if (contextId === 'webgl' || contextId === 'experimental-webgl') {
    return {
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enable: vi.fn(),
      clearColor: vi.fn(),
      clear: vi.fn(),
      useProgram: vi.fn(),
      getAttribLocation: vi.fn(),
      getUniformLocation: vi.fn(),
      vertexAttribPointer: vi.fn(),
      enableVertexAttribArray: vi.fn(),
      uniform1f: vi.fn(),
      uniform2f: vi.fn(),
      uniformMatrix4fv: vi.fn(),
      drawArrays: vi.fn(),
    };
  }
  return originalGetContext.call(this, contextId);
};

// Mock for ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = ResizeObserverMock;

// Mock for navigator.keyboard (used in some tests)
Object.defineProperty(window.navigator, 'keyboard', {
  value: {
    getLayoutMap: vi.fn().mockResolvedValue(new Map()),
    lock: vi.fn(),
    unlock: vi.fn(),
  },
  configurable: true
});

// Suppress canvas error messages during testing
console.warn = vi.fn();
console.error = vi.fn();

// Create a global mock for Fabric.js
vi.mock('fabric', () => {
  return {
    Canvas: vi.fn().mockImplementation(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      renderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      getObjects: vi.fn().mockReturnValue([]),
      setActiveObject: vi.fn(),
      discardActiveObject: vi.fn(),
      getWidth: vi.fn().mockReturnValue(800),
      getHeight: vi.fn().mockReturnValue(600),
      dispose: vi.fn(),
      contains: vi.fn().mockReturnValue(false),
      freeDrawingBrush: {
        color: '#000000',
        width: 1
      },
      getPointer: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      selection: true,
      isDrawingMode: false
    })),
    Object: class MockFabricObject {
      set = vi.fn();
      get = vi.fn();
      selectable = true;
      evented = true;
    },
    Line: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      get: vi.fn(),
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0
    })),
    Text: vi.fn().mockImplementation(() => ({
      set: vi.fn(),
      get: vi.fn(),
      text: '',
      left: 0,
      top: 0
    })),
    PencilBrush: vi.fn().mockImplementation(() => ({
      color: '#000000',
      width: 1
    }))
  };
});
