
import { Canvas as FabricCanvas } from "fabric";
import logger from "@/utils/logger";

/**
 * Validate the canvas for grid operations
 * @param canvas - Fabric canvas to validate
 * @returns Whether canvas is valid
 */
export const validateCanvas = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    logger.error("Canvas validation failed: Canvas is null");
    return false;
  }
  
  if (!canvas.width || !canvas.height) {
    logger.error("Canvas validation failed: Invalid dimensions", {
      width: canvas.width,
      height: canvas.height
    });
    return false;
  }
  
  return true;
};

/**
 * Validate the grid state
 * @param canvas - Fabric canvas containing grid
 * @returns Whether grid state is valid
 */
export const validateGridState = (canvas: FabricCanvas): boolean => {
  if (!validateCanvas(canvas)) {
    return false;
  }
  
  try {
    const gridObjects = canvas.getObjects().filter(obj => 
      (obj as any).objectType === 'grid' || (obj as any).isGrid === true
    );
    
    if (gridObjects.length === 0) {
      logger.warn("Grid state validation: No grid objects found");
      return false;
    }
    
    // Check if all grid objects are visible
    const allVisible = gridObjects.every(obj => obj.visible === true);
    if (!allVisible) {
      logger.warn("Grid state validation: Some grid objects are not visible");
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error("Error validating grid state:", error);
    return false;
  }
};
