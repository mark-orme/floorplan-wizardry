
/**
 * Grid error handling module
 * Handles errors and retries for grid creation
 * @module grid/errorHandling
 */
import { toast } from "sonner";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";

// Re-export from new modular files
export { GridErrorSeverity, categorizeGridError, GRID_ERROR_MESSAGES } from './errorTypes';
export { handleGridCreationError } from './errorHandlers';
export { createGridRecoveryPlan } from './recoveryPlans';
export { trackGridCreationPerformance } from './performanceTracking';
