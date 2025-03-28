
/**
 * Custom expect extensions for testing
 * @module tests/utils/expect-extensions
 */

/**
 * Add custom matchers to jest/vitest expect
 */
export const setupExpectExtensions = () => {
  // Add custom matchers to the global expect object
  if (globalThis.expect) {
    globalThis.expect.extend({
      /**
       * Custom matcher for comparing points
       */
      toBeCloseToPoint(received: any, expected: any, precision: number = 0.001) {
        const pass = 
          Math.abs(received.x - expected.x) < precision && 
          Math.abs(received.y - expected.y) < precision;
        
        if (pass) {
          return {
            message: () => `expected ${JSON.stringify(received)} not to be close to ${JSON.stringify(expected)}`,
            pass: true
          };
        } else {
          return {
            message: () => `expected ${JSON.stringify(received)} to be close to ${JSON.stringify(expected)}`,
            pass: false
          };
        }
      },
      
      /**
       * Custom matcher for comparing grid points
       */
      toBeOnGridPoint(received: any, gridSize: number) {
        const pass = 
          Math.abs(received.x % gridSize) < 0.001 && 
          Math.abs(received.y % gridSize) < 0.001;
        
        if (pass) {
          return {
            message: () => `expected ${JSON.stringify(received)} not to be on a grid point of size ${gridSize}`,
            pass: true
          };
        } else {
          return {
            message: () => `expected ${JSON.stringify(received)} to be on a grid point of size ${gridSize}`,
            pass: false
          };
        }
      }
    });
  }
};
