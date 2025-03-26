
/**
 * Canvas initialization hooks module
 * Re-exports all canvas initialization hooks for easier imports
 * @module canvas-initialization
 */

/**
 * Re-export all canvas initialization hooks
 * Provides centralized access to canvas setup functionality
 * 
 * @example
 * import { 
 *   useCanvasInitialization,
 *   useCanvasGridInitialization
 * } from '@/hooks/canvas-initialization';
 * 
 * // Then use the hooks in your component
 * const { canvasRef, fabricCanvasRef } = useCanvasInitialization();
 * const { gridLayerRef } = useCanvasGridInitialization({...});
 */
export { useCanvasGridInitialization } from './useCanvasGridInitialization';
export { useCanvasRetryLogic } from './useCanvasRetryLogic';
export { useCanvasStateTracking } from './useCanvasStateTracking';
export { useCanvasInitialization } from './useCanvasInitialization';
