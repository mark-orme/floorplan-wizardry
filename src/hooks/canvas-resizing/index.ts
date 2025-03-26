
/**
 * Canvas resizing hooks index module
 * Re-exports functionality from specialized modules
 * @module canvas-resizing
 */

// Export types
export type { UseCanvasResizingProps, ResizingState, CanvasResizingResult } from './types';

// Export constants
export * from './constants';

// Export core hook
export { useCanvasResizing } from './useCanvasResizing';

// Export state management
export { resizingState, resetResizingState } from './state';
