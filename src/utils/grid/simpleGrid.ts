
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Clear grid from canvas
 * @param canvas Fabric canvas instance
 * @param gridObjects Grid objects to remove
 */
export const clearGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Remove each grid object
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    // Force render
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error clearing grid:", error);
  }
};
