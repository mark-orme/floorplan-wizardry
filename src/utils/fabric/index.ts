
/**
 * Fabric utilities module
 * Re-exports from specialized fabric utility modules
 * @module fabric
 */

/**
 * Export all utilities from the specialized files
 * Provides a single import point for fabric-related utilities
 * Organized by functionality for better code organization
 * 
 * @example
 * import { 
 *   getCanvasDimensions, 
 *   isCanvasElementInitialized 
 * } from '@/utils/fabric';
 */

// Export all utilities from the specialized files
export * from './canvasCleanup';
export { 
  CANVAS_DIMENSIONS,
  getCanvasDimensions,
  resizeCanvasToContainer
} from './canvasDimensions';
export { setCanvasDimensions } from './canvasDimensions';
export * from './canvasValidation';
export * from './environment';
export * from './events';
export * from './gestures';
export * from './objects';
export * from './panning';
export * from './registry';
export * from './selection';
