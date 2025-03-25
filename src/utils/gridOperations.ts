/**
 * Grid operation utilities
 * @module gridOperations
 */
import { Canvas as FabricCanvas } from "fabric";
import { 
  canScheduleGridCreation, 
  getCurrentGridState, 
  updateGridState 
} from "./gridManager";
import { 
  scheduleGridProgressReset, 
  acquireGridCreationLock, 
  releaseGridCreationLock 
} from "./gridManager";
import { GridCreationState } from "@/types/drawingTypes";
import logger from "./logger";

/**
 * Check if grid creation should be throttled
 * @returns {boolean} True if throttling is needed
 */
export const shouldThrottleGridCreation = (): boolean => {
  const gridState = getCurrentGridState();
  
  // Check if throttling is needed to prevent excessive grid creation
  if (gridState.lastCreationTime && 
      Date.now() - gridState.lastCreationTime < gridState.throttleInterval && 
      gridState.exists) {
    return true;
  }
  
  // Check if max recreations limit is exceeded
  if (gridState.totalCreations > gridState.maxRecreations && 
      Date.now() - gridState.lastCreationTime < gridState.minRecreationInterval) {
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
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
 * @param {React.Dispatch<React.SetStateAction<number>>} setDebugInfo - Debug info setter
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
  const gridState = getCurrentGridState();
  
  // Check if grid creation is allowed based on current state
  if (!canScheduleGridCreation(gridState)) {
    console.warn("Grid creation is throttled or locked.");
    return [];
  }
  
  // Acquire the grid creation lock
  if (!acquireGridCreationLock()) {
    console.warn("Failed to acquire grid creation lock.");
    return [];
  }
  
  // Update grid state to reflect the attempt
  updateGridState({
    creationInProgress: true,
    lastAttemptTime: Date.now(),
    consecutiveResets: gridState.consecutiveResets + 1
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
      totalCreations: gridState.totalCreations + 1
    });
    
    // Reset grid progress after successful creation
    scheduleGridProgressReset();
    
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
      consecutiveResets: gridState.consecutiveResets + 1
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
    releaseGridCreationLock();
  }
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
    return new fabric.Line([x1, y1, x2, y2], {
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
