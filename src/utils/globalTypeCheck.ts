
/**
 * Global type check utility
 * @module utils/globalTypeCheck
 */
import { getObjectType } from './debug/globalTypeCheck';

/**
 * Initialize global type checkers
 * Sets up utility functions to validate types at runtime
 */
export function initGlobalTypeCheckers(): void {
  console.log('Initializing global type checkers');
  
  // Add to window for debugging in browser
  if (typeof window !== 'undefined') {
    (window as any).__typeCheckers = {
      getObjectType
    };
    
    console.log('Type checkers initialized on window.__typeCheckers');
  }
}

// Re-export functions
export { getObjectType };

