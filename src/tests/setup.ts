
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
    HTMLCanvasElement.prototype.getContext = function(contextId) {
      // Only mock 2d context
      if (contextId === '2d') {
        return {
          canvas: this,
          getContextAttributes: () => ({}),
          globalAlpha: 1.0,
          globalCompositeOperation: 'source-over',
          fillStyle: '#000000',
          strokeStyle: '#000000',
          lineWidth: 1,
          lineCap: 'butt',
          lineJoin: 'miter',
          miterLimit: 10,
          lineDashOffset: 0,
          font: '10px sans-serif',
          textAlign: 'start',
          textBaseline: 'alphabetic',
          direction: 'ltr',
          imageSmoothingEnabled: true,
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
      }
      return null;
    };
  }
}

// Add global mocks or custom matchers here
