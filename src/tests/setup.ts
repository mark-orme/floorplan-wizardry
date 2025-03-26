
/**
 * Vitest setup file
 * @module tests/setup
 */

// This file will run before each test file
// Add any global setup code here

// Setup for Canvas API if needed (for jsdom)
if (typeof window !== 'undefined') {
  // Mock canvas methods that jsdom doesn't implement
  if (!HTMLCanvasElement.prototype.getContext) {
    HTMLCanvasElement.prototype.getContext = function() {
      return {
        fillRect: function() {},
        clearRect: function() {},
        getImageData: function() {
          return {
            data: []
          };
        },
        putImageData: function() {},
        createImageData: function() {
          return [];
        },
        setTransform: function() {},
        drawImage: function() {},
        save: function() {},
        restore: function() {},
        beginPath: function() {},
        moveTo: function() {},
        lineTo: function() {},
        closePath: function() {},
        stroke: function() {},
        translate: function() {},
        scale: function() {},
        rotate: function() {},
        arc: function() {},
        fill: function() {},
        transform: function() {},
        rect: function() {},
        clip: function() {},
      };
    };
  }
}

// Add global mocks or custom matchers here
