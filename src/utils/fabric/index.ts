
/**
 * Fabric utilities index file
 * Re-exports all Fabric.js related utilities for easier imports
 * @module fabric
 */

// Re-export all utilities from the fabric subdirectories
export * from './canvasDimensions';
export * from './canvasValidation';
export * from './canvasCleanup';
// Fix re-export ambiguity issues by being explicit
export { clearCanvasObjects, canvasMoveTo } from './objects';
export { registerCanvasElement, isCanvasRegistered, getCanvasRegistration, unregisterCanvasElement } from './registry';
export * from './environment';
export * from './events';
export * from './selection';
export * from './gestures';
// Export panning functions with explicit naming to avoid conflicts
export { enablePanning, disablePanning } from './panning';

