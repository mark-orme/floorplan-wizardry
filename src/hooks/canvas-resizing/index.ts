
/**
 * Canvas resizing functionality
 * @module canvas-resizing
 */

// Export state
export { DEFAULT_RESIZING_STATE, type ResizingState } from './state';

// Export hooks
export { useResizeLogic } from './useResizeLogic';
export { useCanvasResizing } from './useCanvasResizing';
export { useResponsiveCanvas } from './useResponsiveCanvas';
export { useContainerResizeEffect } from './useContainerResizeEffect';

// Export utility functions
export {
  calculateCanvasDimensions,
  calculateCanvasScale,
  applyCanvasResize
} from './utils';
