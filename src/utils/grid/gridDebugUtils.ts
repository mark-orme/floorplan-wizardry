
/**
 * Grid debugging utilities
 * Functions for inspecting and recovering grid state
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject } from "fabric";

/**
 * Dump grid state to console for debugging
 * @param {Canvas | null} canvas - The Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas) {
    console.warn("Cannot dump grid state: Canvas is null");
    return;
  }
  
  const gridObjects = gridLayerRef.current;
  const allObjects = canvas.getObjects();
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  
  console.log("Canvas state:", {
    width: canvas.width,
    height: canvas.height,
    objectCount: allObjects.length,
    gridObjectCount: Array.isArray(gridObjects) ? gridObjects.length : 0,
    gridObjectsOnCanvas: Array.isArray(gridObjectsOnCanvas) ? gridObjectsOnCanvas.length : 0
  });
  
  console.log("Grid layer state:", {
    objectCount: Array.isArray(gridObjects) ? gridObjects.length : 0,
    firstObject: Array.isArray(gridObjects) && gridObjects.length > 0 ? gridObjects[0] : null,
    onCanvas: Array.isArray(gridObjectsOnCanvas) ? gridObjectsOnCanvas.length : 0,
    missing: Array.isArray(gridObjects) && Array.isArray(gridObjectsOnCanvas) ? 
      gridObjects.length - gridObjectsOnCanvas.length : 0
  });
};

/**
 * Attempt to recover grid issues
 * @param {Canvas | null} canvas - The Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if recovery was attempted
 */
export const attemptGridRecovery = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    console.warn("Cannot recover grid: Canvas is null");
    return false;
  }
  
  const gridObjects = gridLayerRef.current;
  
  if (!Array.isArray(gridObjects) || gridObjects.length === 0) {
    console.warn("No grid objects to recover");
    return false;
  }
  
  let recoveryAttempted = false;
  
  // Check for grid objects not on canvas
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      try {
        canvas.add(obj);
        recoveryAttempted = true;
      } catch (error) {
        console.error("Error re-adding grid object:", error);
      }
    }
  });
  
  if (recoveryAttempted) {
    canvas.requestRenderAll();
    console.log("Grid recovery attempted");
  }
  
  return recoveryAttempted;
};

/**
 * Force recreate the grid
 * @param {Canvas | null} canvas - The Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[] | null} The new grid objects or null if failed
 */
export const forceCreateGrid = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] | null => {
  if (!canvas) {
    console.warn("Cannot force create grid: Canvas is null");
    return null;
  }
  
  console.log("Force creating grid");
  
  // Clean up existing grid objects
  const existingObjects = gridLayerRef.current;
  if (Array.isArray(existingObjects)) {
    existingObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
  }
  
  // Clear grid reference
  gridLayerRef.current = [];
  
  // Create new basic emergency grid
  const result = createBasicEmergencyGrid(canvas, gridLayerRef);
  
  // Force canvas to update
  canvas.requestRenderAll();
  
  return result;
};

/**
 * Create a basic emergency grid on the canvas when primary grid creation fails
 * @param {Canvas} canvas - The Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: canvas is null");
    return [];
  }
  
  // Clean up any existing grid objects
  if (Array.isArray(gridLayerRef.current)) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
  }
  
  gridLayerRef.current = [];
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create a basic grid with larger spacing for performance
  const gridLines: FabricObject[] = [];
  const spacing = Math.min(width, height) / 10;
  
  // Create vertical lines
  for (let i = 0; i <= width; i += spacing) {
    try {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: 'rgba(150, 150, 150, 0.4)',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    } catch (error) {
      console.error("Error creating grid line:", error);
    }
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += spacing) {
    try {
      const line = new fabric.Line([0, i, width, i], {
        stroke: 'rgba(150, 150, 150, 0.4)',
        strokeWidth: 1,
        selectable: false,
        evented: false
      });
      
      gridLines.push(line);
      canvas.add(line);
    } catch (error) {
      console.error("Error creating grid line:", error);
    }
  }
  
  // Update the reference
  gridLayerRef.current = gridLines;
  
  // Force a render
  canvas.requestRenderAll();
  
  return gridLines;
};

