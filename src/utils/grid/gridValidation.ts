
/**
 * Grid validation utilities
 * Provides functions for validating grid state and canvas
 * @module utils/grid/gridValidation
 */
import { Canvas as FabricCanvas } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import logger from '@/utils/logger';

/**
 * Default minimum dimensions for a valid canvas
 */
const DEFAULT_MIN_CANVAS_WIDTH = 100;
const DEFAULT_MIN_CANVAS_HEIGHT = 100;

/**
 * Validate that a canvas is ready for grid creation
 * @param canvas Fabric canvas to validate
 * @returns True if canvas is valid
 */
export const validateCanvas = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.warn('Cannot validate canvas: Canvas is null');
    return false;
  }
  
  // Check canvas dimensions
  const minWidth = GRID_CONSTANTS.MIN_CANVAS_WIDTH || DEFAULT_MIN_CANVAS_WIDTH;
  const minHeight = GRID_CONSTANTS.MIN_CANVAS_HEIGHT || DEFAULT_MIN_CANVAS_HEIGHT;
  
  if (!canvas.width || !canvas.height) {
    logger.warn('Invalid canvas: Missing width or height properties');
    return false;
  }
  
  if (canvas.width < minWidth || canvas.height < minHeight) {
    logger.warn(`Invalid canvas dimensions: ${canvas.width}x${canvas.height}, minimum required: ${minWidth}x${minHeight}`);
    return false;
  }
  
  return true;
};

/**
 * Validate that the grid state is correct
 * @param canvas Fabric canvas to check
 * @returns True if grid state is valid
 */
export const validateGridState = (canvas: FabricCanvas | null): boolean => {
  if (!canvas) {
    logger.warn('Cannot validate grid state: Canvas is null');
    return false;
  }
  
  // Check for grid objects on canvas
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (gridObjects.length === 0) {
    logger.warn('Invalid grid state: No grid objects found on canvas');
    return false;
  }
  
  return true;
};
