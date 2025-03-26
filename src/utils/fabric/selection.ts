
/**
 * Fabric.js selection management utilities
 * Provides functions for enabling and disabling object selection
 * @module fabric/selection
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "../logger";

/**
 * Disable selection mode for objects on the canvas
 * Makes objects non-selectable for drawing modes
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {void}
 * 
 * @example
 * // Disable selection when switching to drawing mode
 * disableSelection(fabricCanvas);
 */
export const disableSelection = (canvas: FabricCanvas): void => {
  // Disable canvas selection
  canvas.selection = false;
  // Change cursor to crosshair for drawing
  canvas.defaultCursor = 'crosshair';
  canvas.hoverCursor = 'crosshair';
  
  // Make objects non-selectable
  canvas.getObjects().forEach(obj => {
    obj.selectable = false;
    (obj as any).hoverCursor = 'crosshair';
  });
  
  // Clear any active selections
  canvas.discardActiveObject();
  canvas.requestRenderAll();
  logger.info("Selection mode disabled");
};

/**
 * Enable selection mode for objects on the canvas
 * Makes objects selectable for selection mode
 * 
 * @param {FabricCanvas} canvas - The Fabric canvas instance
 * @returns {void}
 * 
 * @example
 * // Enable selection when switching to select mode
 * enableSelection(fabricCanvas);
 */
export const enableSelection = (canvas: FabricCanvas): void => {
  // Enable canvas selection
  canvas.selection = true;
  // Change cursor to default for selection
  canvas.defaultCursor = 'default';
  canvas.hoverCursor = 'move';
  
  // Make objects selectable
  canvas.getObjects().forEach(obj => {
    // Skip grid elements
    const objectType = (obj as any).objectType;
    if (!objectType || !objectType.includes('grid')) {
      obj.selectable = true;
      (obj as any).hoverCursor = 'pointer';
    }
  });
  
  // Render canvas to show selection changes
  canvas.requestRenderAll();
  logger.info("Selection mode enabled");
};
