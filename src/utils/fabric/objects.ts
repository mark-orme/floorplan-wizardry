
/**
 * Fabric objects utilities
 * Functions for managing objects on canvas
 * @module fabric/objects
 */
import { Canvas as FabricCanvas, Object as FabricObject, Point } from "fabric";
import logger from "@/utils/logger";

/**
 * Clear all objects from canvas
 * @param {FabricCanvas | null} canvas - Canvas to clear
 * @returns {number} Number of objects removed
 */
export const clearCanvasObjects = (canvas: FabricCanvas | null): number => {
  if (!canvas) return 0;
  
  try {
    const objectCount = canvas.getObjects().length;
    canvas.clear();
    return objectCount;
  } catch (error) {
    logger.error("Error clearing canvas objects:", error);
    return 0;
  }
};

/**
 * Move to position on canvas
 * @param {FabricCanvas | null} canvas - Canvas to pan
 * @param {Point} point - Target point in canvas coordinates
 * @param {boolean} animate - Whether to animate the movement
 */
export const canvasMoveTo = (
  canvas: FabricCanvas | null,
  point: { x: number; y: number },
  animate: boolean = false
): void => {
  if (!canvas) return;
  
  try {
    const vpw = canvas.width as number;
    const vph = canvas.height as number;
    
    // Create a new viewport transform centered on the point
    const vpt = [...canvas.viewportTransform!] as number[];
    vpt[4] = vpw / 2 - point.x * vpt[0];
    vpt[5] = vph / 2 - point.y * vpt[3];
    
    if (animate) {
      // Animate the viewport transformation
      canvas.setCursor('progress');
      
      // Use requestAnimationFrame for smooth animation
      const startVpt = [...canvas.viewportTransform!] as number[];
      const startTime = Date.now();
      const duration = 500;
      
      const animateViewport = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease function (ease-out-cubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        // Interpolate between start and target
        const newVpt = startVpt.map((start, i) => 
          start + (vpt[i] - start) * easedProgress
        ) as [number, number, number, number, number, number];
        
        canvas.setViewportTransform(newVpt);
        
        if (progress < 1) {
          requestAnimationFrame(animateViewport);
        } else {
          canvas.setCursor('default');
        }
      };
      
      requestAnimationFrame(animateViewport);
    } else {
      // Apply immediately
      canvas.setViewportTransform(vpt as [number, number, number, number, number, number]);
    }
  } catch (error) {
    logger.error("Error moving canvas:", error);
  }
};

/**
 * Bring an object to the front of the canvas
 * @param {FabricCanvas | null} canvas - Canvas containing the object
 * @param {FabricObject} object - Object to bring to front
 */
export const bringObjectToFront = (
  canvas: FabricCanvas | null,
  object: FabricObject
): void => {
  if (!canvas || !object) return;
  
  try {
    canvas.bringObjectToFront(object);
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Error bringing object to front:", error);
  }
};

/**
 * Send an object to the back of the canvas
 * @param {FabricCanvas | null} canvas - Canvas containing the object
 * @param {FabricObject} object - Object to send to back
 */
export const sendObjectToBack = (
  canvas: FabricCanvas | null,
  object: FabricObject
): void => {
  if (!canvas || !object) return;
  
  try {
    canvas.sendObjectToBack(object);
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Error sending object to back:", error);
  }
};
