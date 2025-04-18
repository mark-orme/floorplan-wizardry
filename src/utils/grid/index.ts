
/**
 * Grid utilities index
 * Central export point for all grid-related utilities
 * @module utils/grid
 */

// Re-export from canvasGrid
import { createGrid, setGridVisibility, forceGridVisibility, GridOptions } from '@/utils/canvasGrid';

// Re-export individual utility files for direct imports
export { createGrid };
export { createBasicEmergencyGrid, resetGridProgress } from '@/utils/gridCreationUtils';
export { 
  forceGridCreationAndVisibility,
  setGridVisibility,
  updateGridWithZoom
} from './gridVisibility';
export { runGridDiagnostics, applyGridFixes } from './gridDiagnostics';

// Export utility namespaces from exports.ts
export { GridCreation, GridValidation, GridDebug } from './exports';

// Export types
export type { GridOptions };
