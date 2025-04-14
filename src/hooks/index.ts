/**
 * Hooks barrel file
 * Re-exports all hooks for easier importing
 * @module hooks
 */

// Drawing hooks
export * from './drawing';

// Canvas-related hooks
export {
  useCanvasInitialization,
  useCanvasHistory,
  // We're explicitly choosing one of the useCanvasOperations to avoid ambiguity
  useCanvasOperations,
  useCanvasDimensions,
  useGridSnapping
} from './canvas';

// Query hooks
export * from './query';

// Other hooks
export * from './straightLineTool';
export * from './useWallDrawing';
