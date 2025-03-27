/**
 * Grid utility functions
 * Helpers for grid management
 * @module grid/gridUtils
 */
import { Canvas, Object as FabricObject } from "fabric";
import { toast } from "sonner";
import logger from "../logger";
import { createBasicEmergencyGrid } from "../gridCreationUtils";
import { GRID_SPACING } from "@/constants/numerics";

/**
 * Calculate appropriate grid size for canvas dimensions
 * @param {Canvas} canvas - The canvas to calculate for
 * @returns Grid dimensions
 */
export const calculateGridSize = (canvas: Canvas) => {
  if (!canvas) return { width: 0, height: 0 };
  
  // Get canvas dimensions
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Ensure minimum dimensions
  const minWidth = 400;
  const minHeight = 300;
  
  // Calculate dimensions
  const gridWidth = Math.max(width, minWidth);
  const gridHeight = Math.max(height, minHeight);
  
  // Adjust dimensions to be multiples of GRID_SPACING
  const adjustedWidth = Math.ceil(gridWidth / GRID_SPACING) * GRID_SPACING;
  const adjustedHeight = Math.ceil(gridHeight / GRID_SPACING) * GRID_SPACING;
  
  return {
    width: adjustedWidth,
    height: adjustedHeight,
    cellCount: {
      horizontal: Math.floor(adjustedWidth / GRID_SPACING),
      vertical: Math.floor(adjustedHeight / GRID_SPACING)
    }
  };
};

/**
 * Resize grid when canvas dimensions change
 * @param {Canvas} canvas - Canvas to resize grid for
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns Success status
 */
export const resizeGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    logger.error("Cannot resize grid: Canvas is null");
    return false;
  }
  
  if (gridLayerRef.current.length === 0) {
    // No grid to resize, create a new one
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    return gridObjects.length > 0; // Return boolean success status
  }
  
  try {
    // Get dimensions
    const dimensions = calculateGridSize(canvas);
    
    // If grid is too small or too large, recreate it
    const currentGridSize = gridLayerRef.current.length;
    const expectedSize = dimensions.cellCount.horizontal * 2 + dimensions.cellCount.vertical * 2;
    
    if (Math.abs(currentGridSize - expectedSize) > expectedSize * 0.2) {
      logger.info("Grid size mismatch, recreating");
      const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
      return gridObjects.length > 0; // Return boolean success status
    }
    
    // Otherwise, just ensure all grid objects are visible
    let allVisible = true;
    gridLayerRef.current.forEach(obj => {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        allVisible = false;
      }
      obj.visible = true;
    });
    
    // Re-render if we made changes
    if (!allVisible) {
      canvas.requestRenderAll();
    }
    
    return true;
  } catch (error) {
    logger.error("Error resizing grid:", error);
    return false;
  }
};

/**
 * Check grid object count against canvas dimensions
 * @param {Canvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns Check result
 */
export const checkGridCompleteness = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) => {
  if (!canvas) return { complete: false, ratio: 0 };
  
  const dimensions = calculateGridSize(canvas);
  const expectedLines = dimensions.cellCount.horizontal + dimensions.cellCount.vertical;
  const actualLines = gridLayerRef.current.length;
  
  const ratio = actualLines / (expectedLines * 2); // *2 as we typically have small and large lines
  
  return {
    complete: ratio >= 0.8, // 80% or more lines present
    ratio: Math.min(ratio, 1), // Cap at 100%
    expected: expectedLines * 2,
    actual: actualLines
  };
};
