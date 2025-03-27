
/**
 * Utility functions for managing selection state in Fabric.js
 * @module fabric/selection
 */
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Disables selection for all objects on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 */
export const disableSelection = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Disable canvas selection
  canvas.selection = false;
  
  // Make all objects non-selectable
  canvas.forEachObject((obj: FabricObject) => {
    obj.selectable = false;
    obj.evented = false;
  });
  
  // Discard any active selections
  canvas.discardActiveObject();
  canvas.requestRenderAll();
};

/**
 * Enables selection for all objects on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 */
export const enableSelection = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Enable canvas selection
  canvas.selection = true;
  
  // Make all objects selectable except grid objects
  canvas.forEachObject((obj: FabricObject) => {
    // Don't make grid objects selectable
    if (obj.objectType !== 'grid') {
      obj.selectable = true;
      obj.evented = true;
    }
  });
  
  canvas.requestRenderAll();
};

/**
 * Toggles selection state for all objects on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @param {boolean} enable - Whether to enable or disable selection
 */
export const toggleSelection = (canvas: FabricCanvas, enable: boolean): void => {
  if (enable) {
    enableSelection(canvas);
  } else {
    disableSelection(canvas);
  }
};
