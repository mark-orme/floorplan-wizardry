
/**
 * Grid diagnostics utilities
 * @module utils/grid/gridDiagnostics
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { createBasicEmergencyGrid } from "@/utils/gridCreationUtils";

/**
 * Run grid diagnostics
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @param {boolean} verbose - Whether to log verbose information
 * @returns {Object} Diagnostic results
 */
export const runGridDiagnostics = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[],
  verbose: boolean = false
): any => {
  if (!canvas) {
    return { 
      status: 'error', 
      issues: ['Canvas is null'], 
      gridInfo: { objectCount: 0, objectsOnCanvas: 0 } 
    };
  }
  
  // Count grid objects on canvas
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  const issues = [];
  
  // Check for issues
  if (gridObjects.length === 0) {
    issues.push('No grid objects exist');
  }
  
  if (gridObjectsOnCanvas.length === 0 && gridObjects.length > 0) {
    issues.push('No grid objects on canvas');
  }
  
  if (gridObjectsOnCanvas.length < gridObjects.length) {
    issues.push(`Missing ${gridObjects.length - gridObjectsOnCanvas.length} grid objects`);
  }
  
  // Create diagnostic report
  const result = {
    status: issues.length === 0 ? 'ok' : 'warning',
    issues,
    gridInfo: {
      objectCount: gridObjects.length,
      objectsOnCanvas: gridObjectsOnCanvas.length,
      canvasSize: `${canvas.width}x${canvas.height}`
    }
  };
  
  // Log verbose information if requested
  if (verbose) {
    console.log('Grid diagnostics:', result);
  }
  
  return result;
};

/**
 * Apply fixes to grid issues
 * @param {FabricCanvas} canvas - Canvas to fix
 * @param {FabricObject[]} gridObjects - Grid objects to fix
 * @returns {boolean} Whether fixes were applied
 */
export const applyGridFixes = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  
  // Check if fixes are needed
  const diagnostics = runGridDiagnostics(canvas, gridObjects, false);
  
  if (diagnostics.status === 'ok') {
    return false; // No fixes needed
  }
  
  console.log('Applying grid fixes:', diagnostics.issues);
  
  // If missing grid objects, re-add them
  if (diagnostics.gridInfo.objectsOnCanvas < diagnostics.gridInfo.objectCount) {
    console.log('Re-adding missing grid objects');
    
    gridObjects.forEach(obj => {
      if (!canvas.contains(obj)) {
        try {
          canvas.add(obj);
        } catch (error) {
          console.error('Error re-adding grid object:', error);
        }
      }
    });
  }
  
  // If no grid objects at all, recreate the grid
  if (diagnostics.gridInfo.objectCount === 0 || diagnostics.gridInfo.objectsOnCanvas === 0) {
    console.log('Recreating grid from scratch');
    return emergencyGridFix(canvas, { current: gridObjects });
  }
  
  // Force render
  canvas.requestRenderAll();
  
  return true;
};

/**
 * Verify grid visibility
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} Whether grid is visible
 */
export const verifyGridVisibility = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || gridObjects.length === 0) return false;
  
  // Check if at least some grid objects are on canvas and visible
  return gridObjects.some(obj => canvas.contains(obj) && obj.visible !== false);
};

/**
 * Emergency grid fix when all else fails
 * @param {FabricCanvas} canvas - Canvas to fix
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether emergency fix was applied
 */
export const emergencyGridFix = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  try {
    console.log('Applying emergency grid fix');
    
    // Remove any existing grid objects
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    }
    
    // Create new basic grid
    const newGrid = createBasicEmergencyGrid(canvas);
    
    // Update reference
    gridLayerRef.current = newGrid;
    
    // Force render
    canvas.requestRenderAll();
    
    return newGrid.length > 0;
  } catch (error) {
    console.error('Emergency grid fix failed:', error);
    return false;
  }
};
