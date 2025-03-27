
/**
 * Grid creation utilities
 * Provides functions for creating and managing canvas grids
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import { LARGE_GRID, LARGE_GRID_LINE_WIDTH } from "@/constants/numerics";
import { createBasicEmergencyGrid } from "./grid/gridDebugUtils";

/**
 * Verify that a grid exists on the canvas
 * @param canvas - The Fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @returns True if grid exists and is valid
 */
export const verifyGridExists = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  const gridObjects = gridLayerRef.current;
  
  // Check if grid has any objects
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    return false;
  }
  
  // Check if grid objects are on canvas
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return Array.isArray(gridObjectsOnCanvas) && gridObjectsOnCanvas.length > 0;
};

/**
 * Retry an operation with exponential backoff
 * @param operation - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param initialDelay - Initial delay in milliseconds
 * @returns Promise resolving to the operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T> | T,
  maxAttempts: number = 3,
  initialDelay: number = 300
): Promise<T> => {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempts++;
      
      if (attempts >= maxAttempts) {
        break;
      }
      
      // Calculate backoff delay with randomization
      const delay = initialDelay * Math.pow(2, attempts - 1) * (0.9 + Math.random() * 0.2);
      
      // Wait for backoff delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error(`Failed after ${maxAttempts} attempts`);
};

/**
 * Reorder grid objects for better performance and visibility
 * @param gridObjects - Array of grid objects to reorder
 * @returns Reordered array of grid objects
 */
export const reorderGridObjects = (gridObjects: FabricObject[]): FabricObject[] => {
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    return [];
  }
  
  // Separate major and minor grid lines
  const majorLines: FabricObject[] = [];
  const minorLines: FabricObject[] = [];
  
  gridObjects.forEach(obj => {
    if (obj.strokeWidth === LARGE_GRID_LINE_WIDTH) {
      majorLines.push(obj);
    } else {
      minorLines.push(obj);
    }
  });
  
  // Return with major lines on top for better visibility
  return [...minorLines, ...majorLines];
};

/**
 * Create a complete grid with major and minor lines
 * @param canvas - Fabric canvas
 * @param gridLayerRef - Reference to grid layer
 * @returns Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    // For now, delegate to emergency grid if the complete grid fails
    return createBasicEmergencyGrid(canvas, gridLayerRef);
  } catch (error) {
    console.error("Failed to create complete grid:", error);
    return [];
  }
};

/**
 * Validate that the grid is properly created and visible
 * @param canvas - Fabric canvas
 * @param gridLayerRef - Reference to grid layer
 * @returns True if grid is valid
 */
export const validateGrid = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return verifyGridExists(canvas, gridLayerRef);
};

/**
 * Ensure grid exists, creating it if necessary
 * @param canvas - Fabric canvas
 * @param gridLayerRef - Reference to grid layer
 * @returns True if grid exists or was created
 */
export const ensureGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (verifyGridExists(canvas, gridLayerRef)) {
    return true;
  }
  
  try {
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    return Array.isArray(gridObjects) && gridObjects.length > 0;
  } catch (error) {
    console.error("Failed to ensure grid:", error);
    return false;
  }
};

