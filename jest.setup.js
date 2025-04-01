
/**
 * Jest setup file
 * Runs before tests to configure environment
 */

// Mock console methods to prevent noise in test output
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock window methods that aren't implemented in jsdom
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock canvas when it's not available
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = function() {
    return {
      clearRect: function() {},
      beginPath: function() {},
      moveTo: function() {},
      lineTo: function() {},
      arc: function() {},
      fill: function() {},
      stroke: function() {},
      closePath: function() {}
    };
  };
}

// Add test environment helper
global.__TEST__ = true;
