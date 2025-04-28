
import { MockInstance } from 'vitest';

// Define global types for Vitest
declare global {
  // Export all Vitest globals for use in test files
  export const describe: typeof import('vitest')['describe'];
  export const it: typeof import('vitest')['it'];
  export const test: typeof import('vitest')['test'];
  export const expect: typeof import('vitest')['expect'];
  export const beforeAll: typeof import('vitest')['beforeAll'];
  export const afterAll: typeof import('vitest')['afterAll'];
  export const beforeEach: typeof import('vitest')['beforeEach'];
  export const afterEach: typeof import('vitest')['afterEach'];
  export const vi: typeof import('vitest')['vi'];

  // Helper type for mocks
  export type Mock<T = any> = MockInstance<T>;
  
  // Define MockCanvasInterface for consistent testing
  export interface MockCanvasInterface {
    on: Mock;
    off: Mock;
    add: Mock;
    remove: Mock;
    getObjects: Mock;
    dispose: Mock;
    renderAll: Mock;
    requestRenderAll: Mock;
    getPointer: Mock;
    isDrawingMode: boolean;
  }
}

// Export nothing, this is just for types
export {};
