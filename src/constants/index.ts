
/**
 * Constants barrel file
 * Re-exports all constants used in the application
 * @module constants
 */

// Re-export constants - fix DrawingMode ambiguity by explicitly exporting
export { default as drawingConstants } from './drawingConstants';
export * from './drawingConstants';
export * from './canvasConstants';
export * from './errorMessages';
export * from './gridConstants';

// Export DrawingMode from drawingModes as the canonical source
export { DrawingMode } from './drawingModes';
