
/**
 * Custom Jest expect extensions
 * Adds additional matchers for testing
 */
import { expect } from 'vitest';
import '@testing-library/jest-dom';
import matchers from '@testing-library/jest-dom/matchers';

// Only extend if not already extended
if (typeof (expect as any).toBeInTheDocument === 'undefined') {
  expect.extend(matchers);
}

// Add custom matchers for canvas testing
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
  },
  
  toHaveGridSize(grid: any, size: number) {
    const pass = grid && grid.size === size;
    if (pass) {
      return {
        message: () => `expected grid not to have size ${size}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected grid to have size ${size}, but got ${grid?.size}`,
        pass: false,
      };
    }
  },
  
  toBePointClose(received: { x: number, y: number }, expected: { x: number, y: number }, precision = 0.001) {
    const xDiff = Math.abs(received.x - expected.x);
    const yDiff = Math.abs(received.y - expected.y);
    const pass = xDiff <= precision && yDiff <= precision;
    
    if (pass) {
      return {
        message: () => `expected ${JSON.stringify(received)} not to be close to ${JSON.stringify(expected)}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${JSON.stringify(received)} to be close to ${JSON.stringify(expected)}, but x diff was ${xDiff} and y diff was ${yDiff}`,
        pass: false,
      };
    }
  },
  
  toBeAngleClose(received: number, expected: number, precision = 0.1) {
    const diff = Math.abs(received - expected);
    const pass = diff <= precision;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be close to ${expected} degrees`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be close to ${expected} degrees, but difference was ${diff}`,
        pass: false,
      };
    }
  }
});

// Ensure the global expect is properly typed
if (typeof global !== 'undefined') {
  (global as any).expect = expect;
}

// Export types for the new matchers
declare global {
  namespace Vi {
    interface Assertion {
      toHaveCanvasSize(width: number, height: number): void;
      toHaveGridSize(size: number): void;
      toBePointClose(expected: { x: number, y: number }, precision?: number): void;
      toBeAngleClose(expected: number, precision?: number): void;
    }
  }
}

// Make sure tests import this file to get the extensions
export {};
