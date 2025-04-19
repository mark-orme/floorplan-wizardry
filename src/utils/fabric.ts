
/**
 * Fabric.js utility functions
 * @module utils/fabric
 */
import { Canvas as FabricCanvas } from 'fabric';

/**
 * Set canvas dimensions with proper scaling
 * @param canvas - Fabric canvas instance
 * @param width - New width
 * @param height - New height
 */
export const setCanvasDimensions = (canvas: FabricCanvas, width: number, height: number) => {
  if (!canvas) return;
  
  // The API has changed in latest Fabric.js - let's fix it for compatibility
  try {
    // Try the newer version API first (two parameters)
    canvas.setDimensions({ width, height });
  } catch (e) {
    console.error('Error setting canvas dimensions:', e);
    try {
      // Fallback to older API if needed
      (canvas as any).setDimensions(width, height);
    } catch (e2) {
      console.error('Failed to set canvas dimensions with fallback method:', e2);
    }
  }

  canvas.requestRenderAll();
};

/**
 * Clear all objects from canvas
 * @param canvas - Fabric canvas instance
 * @param preserveGrid - Whether to preserve grid objects
 */
export const clearCanvas = (canvas: FabricCanvas, preserveGrid: boolean = false) => {
  if (!canvas) return;
  
  if (preserveGrid) {
    // Remove all objects except those with gridObject property
    const objects = canvas.getObjects().filter(obj => !(obj as any).gridObject);
    if (objects.length > 0) {
      canvas.remove(...objects);
    }
  } else {
    // Remove all objects
    canvas.clear();
  }
  
  canvas.requestRenderAll();
};
