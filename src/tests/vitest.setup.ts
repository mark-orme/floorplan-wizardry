
/**
 * Vitest Setup File
 * Configures the testing environment
 * This file is used by Vitest only when running tests
 */

// Make sure we're in a test environment before trying to import test-related packages
if (import.meta.env.MODE === 'test') {
  // These will only be executed when running tests
  const { cleanup } = require('@testing-library/react');
  const matchers = require('@testing-library/jest-dom/matchers');
  const { expect, afterEach, beforeEach, vi } = require('vitest');

  // Extend expect with testing-library matchers
  expect.extend(matchers);

  // Clean up after each test
  afterEach(() => {
    cleanup();
  });

  // Mock window.matchMedia
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

  // Mock requestAnimationFrame
  global.requestAnimationFrame = callback => {
    setTimeout(callback, 0);
    return 0;
  };

  // Mock canvas methods
  if (typeof window !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => {
      return {
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Array(4),
        })),
        putImageData: vi.fn(),
        drawImage: vi.fn(),
        save: vi.fn(),
        fillText: vi.fn(),
        restore: vi.fn(),
        beginPath: vi.fn(),
        moveTo: vi.fn(),
        lineTo: vi.fn(),
        bezierCurveTo: vi.fn(),
        closePath: vi.fn(),
        stroke: vi.fn(),
        translate: vi.fn(),
        scale: vi.fn(),
        rotate: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        measureText: vi.fn(() => ({ width: 0 })),
        setTransform: vi.fn(),
        resetTransform: vi.fn(),
        createLinearGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
        createPattern: vi.fn(() => ({})),
        createRadialGradient: vi.fn(() => ({
          addColorStop: vi.fn(),
        })),
        canvas: document.createElement('canvas'),
      } as unknown as CanvasRenderingContext2D;
    });
  }
}
