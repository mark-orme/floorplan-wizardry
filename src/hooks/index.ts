
/**
 * Hooks Barrel Export
 * Re-exports all hooks from a central location
 */

// Canvas operation hooks
export * from './useRateLimitedUpdate';
export * from './useValidatedForm';
export * from './useFloorPlans';
export * from './useDrawingErrorReporting';

// Canvas drawing hooks
export * from './canvas-operations/useCanvasOperations';
export * from './canvas-operations/useToolOperations';
export * from './drawing/useDrawingActions';
export * from './drawing/useDrawingHistory';

// Straight line tool hooks - explicitly re-export to avoid ambiguity
export { 
  useLineState,
  useApplePencilSupport,
  useEnhancedGridSnapping,
  // Re-export InputMethod by renaming it to avoid conflicts
  InputMethod as LineInputMethod
} from './straightLineTool';
