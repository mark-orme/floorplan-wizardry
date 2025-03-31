
/**
 * Grid validation utilities
 * Provides functions to validate grid state and canvas
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Validate canvas for grid rendering
 * @param {FabricCanvas} canvas - Fabric canvas to validate
 * @returns {boolean} Whether canvas is valid for grid
 */
export const validateCanvas = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.error("Grid validation failed: Canvas is null");
    return false;
  }
  
  // Check if canvas has valid dimensions
  if (!canvas.width || !canvas.height || 
      canvas.width <= 0 || canvas.height <= 0 ||
      canvas.width < GRID_CONSTANTS.MIN_CANVAS_WIDTH || 
      canvas.height < GRID_CONSTANTS.MIN_CANVAS_HEIGHT) {
    logger.error("Grid validation failed: Invalid canvas dimensions", {
      width: canvas.width,
      height: canvas.height,
      minWidth: GRID_CONSTANTS.MIN_CANVAS_WIDTH,
      minHeight: GRID_CONSTANTS.MIN_CANVAS_HEIGHT
    });
    return false;
  }
  
  return true;
};

/**
 * Validate grid state
 * Checks if grid is correctly initialized on canvas
 * @param {FabricCanvas} canvas - Fabric canvas to check
 * @returns {boolean} Whether grid state is valid
 */
export const validateGridState = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    logger.error("Grid state validation failed: Canvas is null");
    return false;
  }
  
  // Get all grid objects on canvas
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  // Check if there are grid objects
  if (gridObjects.length === 0) {
    logger.warn("Grid state validation failed: No grid objects found");
    return false;
  }
  
  // Check if at least some horizontal and vertical grid lines exist
  const horizontalLines = gridObjects.filter(obj => {
    const points = (obj as any).points || [];
    return points.length === 4 && points[1] === points[3];
  });
  
  const verticalLines = gridObjects.filter(obj => {
    const points = (obj as any).points || [];
    return points.length === 4 && points[0] === points[2];
  });
  
  if (horizontalLines.length === 0 || verticalLines.length === 0) {
    logger.warn("Grid state validation failed: Missing grid lines", {
      horizontalLines: horizontalLines.length,
      verticalLines: verticalLines.length
    });
    return false;
  }
  
  return true;
};
