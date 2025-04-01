
/**
 * Global TypeScript declarations for Vitest
 * Makes Vitest types available globally in test files
 */
import { vi, expect, describe, it, beforeEach, afterEach, Mock } from 'vitest';

// Make Vitest APIs available globally in tests
declare global {
  const vi: typeof import('vitest')['vi'];
  const expect: typeof import('vitest')['expect'];
  const describe: typeof import('vitest')['describe'];
  const it: typeof import('vitest')['it'];
  const beforeEach: typeof import('vitest')['beforeEach'];
  const afterEach: typeof import('vitest')['afterEach'];
  
  // Add Mock type globally
  type Mock<T extends (...args: any[]) => any> = import('vitest').Mock<T>;
  
  // Make Canvas mocks work with vi.fn()
  interface MockCanvasInterface {
    on: Mock<any>;
    off: Mock<any>;
    add: Mock<any>;
    remove: Mock<any>;
    getObjects: Mock<any>;
    dispose: Mock<any>;
    renderAll: Mock<any>;
    requestRenderAll: Mock<any>;
    getPointer: Mock<any>;
    isDrawingMode: boolean;
  }
}

// Export nothing, this is just for types
export {};
