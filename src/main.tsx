
/**
 * Application entry module
 * Re-exports from main modules
 * @module main
 */

// Import functions from main/index.ts
import { setupSentry, initializeApp } from './main/index';

// Export directly from the imported modules to avoid duplicate declarations
export { setupSentry, initializeApp };
