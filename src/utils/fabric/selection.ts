
/**
 * Canvas selection utilities
 * Functions to enable and disable object selection modes
 * @module fabric/selection
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Enable selection mode for objects on canvas
 * Makes objects selectable while keeping grid elements protected
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 */
export const enableSelection = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Enable selection but disable group selection (lasso)
  canvas.selection = false;
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'pointer';
  
  // Make objects selectable, but not grid elements
  canvas.getObjects().forEach(obj => {
    const objectType = obj.objectType as string | undefined;
    
    if (objectType && objectType.includes('grid')) {
      // Grid elements are never selectable
      obj.selectable = false;
      obj.evented = false;
      obj.hoverCursor = 'default';
    } else {
      // Non-grid elements are selectable
      obj.selectable = true;
      obj.hoverCursor = 'pointer';
      
      // Ensure lines and polylines are selectable
      const isLineType = obj.type === 'polyline' || obj.type === 'line' || objectType === 'line';
      if (isLineType) {
        obj.selectable = true;
        obj.evented = true;
        obj.hoverCursor = 'pointer';
        
        // Increase hit box for easier selection
        obj.strokeWidth = Math.max(obj.strokeWidth || 2, 2);
        obj.perPixelTargetFind = false;
        obj.targetFindTolerance = 10;
      }
    }
  });
  
  canvas.requestRenderAll();
  logger.info("Selection mode enabled - objects can now be selected");
}

/**
 * Disable selection mode for all objects on canvas
 * Used when switching to drawing or other non-selection tools
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 */
export const disableSelection = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Disable selection globally
  canvas.selection = false;
  canvas.defaultCursor = 'crosshair';
  
  // Make all objects non-selectable
  canvas.getObjects().forEach(obj => {
    obj.selectable = false;
    obj.evented = false;
  });
  
  // Clear any active selection
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  logger.info("Selection mode disabled");
}
