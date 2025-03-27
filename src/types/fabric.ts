
/**
 * Re-export types from fabric.d.ts
 * @module types/fabric
 */

// Define the exports directly instead of re-exporting from the same file
// This fixes the circular reference issue
export type { 
  CanvasCreationOptions,
  CanvasReferences,
  GridDimensions,
  GridRenderResult,
  CustomTouchEvent,
  CustomFabricTouchEvent
} from './fabric.d';
