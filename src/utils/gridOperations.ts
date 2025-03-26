/**
 * Grid operation utilities
 * @module gridOperations
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { GridCreationState } from "@/types/drawingTypes";
import logger from "./logger";

// Current grid state
const gridState: GridCreationState = {
  isCreating: false,
  attempts: 0,
  success: false,
  error: undefined,
  creationInProgress: false,
  consecutiveResets: 0,
  maxConsecutiveResets: 5,
  lastAttemptTime: 0,
  lastCreationTime: 0,
  throttleInterval: 1000,
  exists: false,
  safetyTimeout: null,
  totalCreations: 0,
  maxRecreations: 20,
  minRecreationInterval: 5000,
  lastDimensions: null,
  creationLock: {
    id: 0,
    timestamp: 0,
    isLocked: false
  }
};

/**
 * Check if grid creation can be scheduled based on current state
 * @param {GridCreationState} state - Current grid state
 * @returns {boolean} True if creation can be scheduled
 */
export const canScheduleGridCreation = (state: GridCreationState = gridState): boolean => {
  // If creation is already in progress, don't schedule another
  if (state.creationInProgress) return false;
  
  // If we've had too many consecutive resets, throttle creation
  if (state.consecutiveResets && state.maxConsecutiveResets && 
      state.consecutiveResets > state.maxConsecutiveResets) return false;
  
  // If we've recently created a grid, throttle creation
  if (state.lastCreationTime && state.throttleInterval && 
      Date.now() - state.lastCreationTime < state.throttleInterval && 
      state.exists) return false;
  
  return true;
};

/**
 * Get current grid state
 * @returns {GridCreationState} Current grid state
 */
export const getCurrentGridState = (): GridCreationState => {
  return gridState;
};

/**
 * Update grid state
 * @param {Partial<GridCreationState>} updates - Updates to apply to grid state
 */
export const updateGridState = (updates: Partial<GridCreationState>): void => {
  Object.assign(gridState, updates);
};

/**
 * Check if grid creation should be throttled
 * @returns {boolean} True if throttling is needed
 */
export const shouldThrottleGridCreation = (): boolean => {
  const state = getCurrentGridState();
  
  // Check if throttling is needed to prevent excessive grid creation
  if (state.lastCreationTime && state.throttleInterval && 
      Date.now() - state.lastCreationTime < state.throttleInterval && 
      state.exists) {
    return true;
  }
  
  // Check if max recreations limit is exceeded
  if (state.totalCreations && state.maxRecreations && state.minRecreationInterval && 
      state.totalCreations > state.maxRecreations && 
      state.lastCreationTime && 
      Date.now() - state.lastCreationTime < state.minRecreationInterval) {
    return true;
  }
  
  return false;
};

/**
 * Attempt to create the grid on the canvas
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 * @param {React.Dispatch<React.SetStateAction<string | null>>} setErrorMessage - Error message setter
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setHasError - Error state setter
 * @param {any} setDebugInfo - Debug info setter
 * @param {Function} gridCreationCallback - Callback after grid creation
 * @returns {FabricObject[]} Array of grid lines
 */
export const tryCreateGrid = (
  canvas: FabricCanvas,
  width: number,
  height: number,
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setHasError: React.Dispatch<React.SetStateAction<boolean>>,
  setDebugInfo: any,
  gridCreationCallback: any
): any[] => {
  const state = getCurrentGridState();
  
  if (!canScheduleGridCreation(state)) {
    console.warn("Grid creation is throttled or locked.");
    return [];
  }
  
  // Acquire the grid creation lock
  if (!acquireGridCreationLock("tryCreateGrid")) {
    console.warn("Failed to acquire grid creation lock.");
    return [];
  }
  
  try {
    // Update grid state to reflect the attempt
    updateGridState({
      isCreating: true,
      attempts: (state.attempts || 0) + 1,
      creationInProgress: true,
      lastAttemptTime: Date.now(),
      consecutiveResets: (state.consecutiveResets || 0) + 1
    });
    
    // Create grid lines
    const gridLines = createGridLines(canvas, width, height);
    
    // Update grid state on success
    updateGridState({
      isCreating: false,
      success: true,
      creationInProgress: false,
      consecutiveResets: 0,
      lastCreationTime: Date.now(),
      exists: true,
      totalCreations: (state.totalCreations || 0) + 1
    });
    
    // Reset grid progress after successful creation
    scheduleGridProgressReset("success");
    
    // Update debug info and execute callback
    setDebugInfo((prevDebugInfo: any) => ({
      ...prevDebugInfo,
      gridCreationAttempts: prevDebugInfo.gridCreationAttempts + 1,
      lastGridCreationTime: Date.now()
    }));
    
    gridCreationCallback(true);
    
    return gridLines;
  } catch (error: any) {
    console.error("Grid creation failed:", error);
    
    updateGridState({
      isCreating: false,
      success: false,
      error: error.message,
      creationInProgress: false,
      consecutiveResets: (state.consecutiveResets || 0) + 1
    });
    
    setErrorMessage(`Grid creation failed: ${error.message}`);
    setHasError(true);
    
    // Update debug info
    setDebugInfo((prevDebugInfo: any) => ({
      ...prevDebugInfo,
      gridCreationFailures: prevDebugInfo.gridCreationFailures + 1,
      lastError: error.message,
      lastErrorTime: Date.now()
    }));
    
    gridCreationCallback(false);
    
    return [];
  } finally {
    // Release the grid creation lock
    releaseGridCreationLock("tryCreateGrid");
  }
};

/**
 * Acquire grid creation lock
 */
export const acquireGridCreationLock = (id: string): boolean => {
  const state = getCurrentGridState();
  if (state.creationLock && state.creationLock.isLocked) return false;
  
  updateGridState({
    creationLock: {
      id: Date.now(),
      timestamp: Date.now(),
      isLocked: true
    }
  });
  return true;
};

/**
 * Release grid creation lock
 */
export const releaseGridCreationLock = (id: string): void => {
  updateGridState({
    creationLock: {
      id: 0,
      timestamp: 0,
      isLocked: false
    }
  });
};

/**
 * Schedule grid progress reset
 * @param {string} reason - Reason for reset
 * @returns {number} Timeout ID
 */
export const scheduleGridProgressReset = (reason: string): number => {
  const timeoutId = window.setTimeout(() => {
    updateGridState({
      creationInProgress: false
    });
  }, 5000);
  return timeoutId;
};

/**
 * Create grid lines for the canvas
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {number} width - Width of the canvas
 * @param {number} height - Height of the canvas
 * @returns {FabricObject[]} Array of grid lines
 */
export const createGridLines = (canvas: FabricCanvas, width: number, height: number): any[] => {
  const gridSize = 20; // Define grid size
  const gridLines: any[] = [];
  
  // Function to create a grid line
  const createLine = (x1: number, y1: number, x2: number, y2: number) => {
    return new Line([x1, y1, x2, y2], {
      stroke: '#cccccc',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
  };
  
  // Create vertical grid lines
  for (let i = gridSize; i < width; i += gridSize) {
    const line = createLine(i, 0, i, height);
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create horizontal grid lines
  for (let j = gridSize; j < height; j += gridSize) {
    const line = createLine(0, j, width, j);
    gridLines.push(line);
    canvas.add(line);
  }
  
  return gridLines;
};
