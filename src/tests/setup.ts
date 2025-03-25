
/**
 * Vitest setup configuration
 * @module setup
 */

import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Mock window functions
beforeAll(() => {
  // Mock requestAnimationFrame
  global.requestAnimationFrame = (callback) => {
    return setTimeout(callback, 0);
  };
  
  // Mock cancelAnimationFrame
  global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
  };

  // Mock requestIdleCallback
  if (!global.requestIdleCallback) {
    global.requestIdleCallback = (callback) => {
      return setTimeout(() => callback({
        didTimeout: false,
        timeRemaining: () => 50
      }), 0);
    };
  }
  
  // Mock canvas methods
  if (typeof window !== 'undefined') {
    // Mock for HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      writable: true,
      value: () => ({
        fillRect: () => {},
        clearRect: () => {},
        getImageData: (x: number, y: number, w: number, h: number) => ({
          data: new Array(w * h * 4)
        }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
      }),
    });
  }
});
