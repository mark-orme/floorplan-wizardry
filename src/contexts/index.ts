
/**
 * Re-export all context providers and hooks
 */

// Re-export auth context
export * from './AuthContext';

// Re-export drawing context
export { 
  DrawingContext,
  useDrawingContext,
  useDrawing,
  DrawingProvider
} from './DrawingContext';

// Re-export canvas context
export {
  CanvasProvider,
  useCanvasContext,
  useCanvas
} from './CanvasContext';

// Re-export any other contexts
// export * from './OtherContext';
