
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Define global mocks for Jest -> Vitest transition
global.vi = vi;

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.ResizeObserver = ResizeObserverMock;

// Mock canvas
global.HTMLCanvasElement.prototype.getContext = () => {
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
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    strokeRect: vi.fn(),
    strokeText: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
  };
};

// Mock PointerEvent if not available
if (typeof window.PointerEvent !== 'function') {
  class MockPointerEvent extends Event {
    constructor(type: string, options: any = {}) {
      super(type, options);
      this.pointerId = options.pointerId || 0;
      this.pointerType = options.pointerType || 'mouse';
    }
    pointerId: number;
    pointerType: string;
  }
  global.PointerEvent = MockPointerEvent as any;
}

// Set up mock for window.matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
};

// Console error and warning handling for tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('React does not recognize the') || 
    args[0].includes('Invalid prop'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (
    args[0] && 
    typeof args[0] === 'string' && 
    (args[0].includes('componentWillMount') || 
    args[0].includes('componentWillUpdate') || 
    args[0].includes('componentWillReceiveProps'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};
