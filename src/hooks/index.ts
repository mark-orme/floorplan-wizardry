
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
  // Remove the non-existent exports
  // useApplePencilSupport,
  // useEnhancedGridSnapping,
  // Re-export InputMethod by renaming it to avoid conflicts
  // Use 'export type' for type-only exports when isolatedModules is enabled
  type InputMethod as LineInputMethod
} from './straightLineTool';

