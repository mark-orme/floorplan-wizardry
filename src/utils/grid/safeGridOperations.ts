
/**
 * Safe grid operations
 * Type-safe utilities for grid management with proper checks
 * @module grid/safeGridOperations
 */
import { Canvas, Object as FabricObject } from "fabric";

/**
 * Safely verify if grid exists on canvas
 * Handles null/undefined canvas and grid objects
 * 
 * @param canvas - Fabric canvas instance
 * @param gridLayerRef - Reference to grid layer objects
 * @returns True if grid exists and is on canvas
 */
export function verifyGridExists(
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean {
  // Check if canvas exists
  if (!canvas) {
    return false;
  }
  
  // Check if grid layer exists and has objects
  if (!gridLayerRef || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if objects are on canvas
  for (const obj of gridLayerRef.current) {
    if (!canvas.contains(obj)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Safely send grid objects to back of canvas
 * Handles null/undefined canvas and grid objects
 * 
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Grid objects to send to back
 * @returns True if operation was successful
 */
export function sendGridToBack(
  canvas: Canvas | null,
  gridObjects: FabricObject[]
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  try {
    // Send each grid object to back of canvas
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendToBack(obj);
      }
    });
    
    // Request render to update canvas
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    console.error("Error sending grid to back:", error);
    return false;
  }
}

/**
 * Safely update grid object properties
 * Handles null/undefined canvas and grid objects
 * 
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Grid objects to update
 * @param properties - Properties to update
 * @returns True if operation was successful
 */
export function updateGridProperties(
  canvas: Canvas | null,
  gridObjects: FabricObject[],
  properties: Partial<FabricObject>
): boolean {
  if (!canvas || !gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  try {
    // Update properties for each grid object
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        obj.set(properties);
      }
    });
    
    // Request render to update canvas
    canvas.requestRenderAll();
    return true;
  } catch (error) {
    console.error("Error updating grid properties:", error);
    return false;
  }
}

/**
 * Safely check if grid needs recreation
 * Compares existing grid dimensions to current canvas
 * 
 * @param canvas - Fabric canvas instance
 * @param gridLayerRef - Reference to grid layer objects
 * @param currentDimensions - Current canvas dimensions
 * @returns True if grid needs recreation
 */
export function shouldRecreateGrid(
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  currentDimensions: { width: number; height: number }
): boolean {
  if (!canvas || !gridLayerRef || !gridLayerRef.current || gridLayerRef.current.length === 0) {
    return true; // Grid doesn't exist, so it needs creation
  }
  
  // Check if canvas dimensions match grid dimensions
  if (canvas.width !== currentDimensions.width || canvas.height !== currentDimensions.height) {
    return true; // Dimensions have changed, recreate grid
  }
  
  // Check if all grid objects are on canvas
  for (const obj of gridLayerRef.current) {
    if (!canvas.contains(obj)) {
      return true; // At least one grid object is missing
    }
  }
  
  return false; // Grid is valid, no need to recreate
}
