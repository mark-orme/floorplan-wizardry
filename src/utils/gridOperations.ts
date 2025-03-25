
/**
 * Grid operation utilities
 * @module gridOperations
 */
import { Canvas as FabricCanvas, Line } from "fabric";
import { GridCreationState } from "@/types/drawingTypes";
import logger from "./logger";

// Since canScheduleGridCreation, getCurrentGridState, and updateGridState are missing, let's implement them

/**
 * Current grid state
 */
const gridState: GridCreationState = {
  creationInProgress: false,
  consecutiveResets: 0,
  maxConsecutiveResets: 5,
  lastAttemptTime: 0,
  creationLock: false,
  safetyTimeout: null,
  lastCreationTime: 0,
  lastDimensions: null,
  exists: false,
  throttleInterval: 1000, // 1 second throttle
  totalCreations: 0,
  maxRecreations: 20,
  minRecreationInterval: 5000 // 5 seconds
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
  if (state.consecutiveResets > state.maxConsecutiveResets) return false;
  
  // If we've recently created a grid, throttle creation
  if (state.lastCreationTime && 
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
  if (state.lastCreationTime && 
      Date.now() - state.lastCreationTime < state.throttleInterval && 
      state.exists) {
    return true;
  }
  
  // Check if max recreations limit is exceeded
  if (state.totalCreations > state.maxRecreations && 
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
  
  // Check if grid creation is allowed based on current state
  if (!canScheduleGridCreation(state)) {
    console.warn("Grid creation is throttled or locked.");
    return [];
  }
  
  // Acquire the grid creation lock
  if (!acquireGridCreationLock("tryCreateGrid")) {
    console.warn("Failed to acquire grid creation lock.");
    return [];
  }
  
  // Update grid state to reflect the attempt
  updateGridState({
    creationInProgress: true,
    lastAttemptTime: Date.now(),
    consecutiveResets: state.consecutiveResets + 1
  });
  
  try {
    // Create grid lines
    const gridLines = createGridLines(canvas, width, height);
    
    // Update grid state on success
    updateGridState({
      creationInProgress: false,
      consecutiveResets: 0,
      lastCreationTime: Date.now(),
      exists: true,
      totalCreations: state.totalCreations + 1
    });
    
    // Reset grid progress after successful creation
    scheduleGridProgressReset("success");
    
    // Update debug info
    setDebugInfo((prevDebugInfo: any) => ({
      ...prevDebugInfo,
      gridCreationAttempts: prevDebugInfo.gridCreationAttempts + 1,
      lastGridCreationTime: Date.now()
    }));
    
    // Execute callback
    gridCreationCallback(true);
    
    return gridLines;
  } catch (error: any) {
    console.error("Grid creation failed:", error);
    
    // Update grid state on failure
    updateGridState({
      creationInProgress: false,
      consecutiveResets: state.consecutiveResets + 1
    });
    
    // Set error message and state
    setErrorMessage(`Grid creation failed: ${error.message}`);
    setHasError(true);
    
    // Update debug info
    setDebugInfo((prevDebugInfo: any) => ({
      ...prevDebugInfo,
      gridCreationFailures: prevDebugInfo.gridCreationFailures + 1,
      lastError: error.message,
      lastErrorTime: Date.now()
    }));
    
    // Execute callback
    gridCreationCallback(false);
    
    return [];
  } finally {
    // Release the grid creation lock
    releaseGridCreationLock("tryCreateGrid");
  }
};

/**
 * Implement missing functions
 */
export const acquireGridCreationLock = (id: string): boolean => {
  if (gridState.creationLock) return false;
  gridState.creationLock = true;
  return true;
};

export const releaseGridCreationLock = (id: string): void => {
  gridState.creationLock = false;
};

export const scheduleGridProgressReset = (reason: string): number => {
  const timeoutId = window.setTimeout(() => {
    gridState.creationInProgress = false;
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
