
/**
 * Organized grid utility exports
 * Grouped by functionality for cleaner imports
 */
import { createGrid, forceGridVisibility } from '@/utils/canvasGrid';
import { createBasicEmergencyGrid, resetGridProgress } from '@/utils/gridCreationUtils';
import { forceGridCreationAndVisibility } from '@/utils/grid/gridVisibility';
import { runGridDiagnostics } from '@/utils/diagnostics/straightLineValidator';

/**
 * Grid creation utilities
 */
export const GridCreation = {
  createGrid,
  createEmergencyGrid: createBasicEmergencyGrid,
  forceGridVisibility,
  forceGridCreationAndVisibility,
  resetProgress: resetGridProgress
};

/**
 * Grid validation utilities
 */
export const GridValidation = {
  runDiagnostics: runGridDiagnostics
};

/**
 * Grid debugging utilities
 */
export const GridDebug = {
  fix: forceGridCreationAndVisibility,
  reset: resetGridProgress,
  forceVisible: forceGridVisibility
};
