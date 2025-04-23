
/**
 * Utility for creating grid lines on canvas
 * Provides robust error handling and compatibility with different Fabric.js versions
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { captureError } from '@/utils/sentry';

/**
 * Creates a simple grid pattern on the canvas
 * @param canvas - Fabric canvas instance
 * @param gridSize - Size of grid cells (default: 50px)
 * @param gridColor - Color of grid lines (default: #e0e0e0)
 * @returns Array of grid line objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas, 
  gridSize: number = 50, 
  gridColor: string = '#e0e0e0'
): any[] => {
  console.log("Creating grid - initializing");
  
  if (!canvas) {
    console.warn("Cannot create grid: canvas is null");
    return [];
  }

  try {
    const gridObjects: any[] = [];
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      try {
        const line = new Line([i, 0, i, height], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        canvas.add(line);
        gridObjects.push(line);
        
        // Check if the method exists before calling
        if (line && typeof line.sendToBack === 'function') {
          line.sendToBack();
        } else if (canvas.bringToBack && typeof canvas.bringToBack === 'function') {
          canvas.bringToBack(line);
        }
      } catch (error) {
        console.error("Error creating vertical grid line:", error);
        captureError(error instanceof Error ? error : new Error(String(error)), 'grid-creation');
      }
    }

    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      try {
        const line = new Line([0, i, width, i], {
          stroke: gridColor,
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hoverCursor: 'default'
        });
        canvas.add(line);
        gridObjects.push(line);
        
        // Check if the method exists before calling
        if (line && typeof line.sendToBack === 'function') {
          line.sendToBack();
        } else if (canvas.bringToBack && typeof canvas.bringToBack === 'function') {
          canvas.bringToBack(line);
        }
      } catch (error) {
        console.error("Error creating horizontal grid line:", error);
        captureError(error instanceof Error ? error : new Error(String(error)), 'grid-creation');
      }
    }

    try {
      canvas.renderAll();
    } catch (error) {
      console.error("Error rendering canvas after grid creation:", error);
      captureError(error instanceof Error ? error : new Error(String(error)), 'grid-render');
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Fatal error creating grid:", error);
    captureError(error instanceof Error ? error : new Error(String(error)), 'grid-fatal');
    return [];
  }
};

/**
 * Ensures grid is visible by bringing it to the back
 * Enhanced with careful error handling for each step
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Array of grid line objects
 */
export const ensureGridVisible = (
  canvas: FabricCanvas,
  gridObjects: any[]
): void => {
  if (!canvas) {
    console.warn('Cannot ensure grid visibility: canvas is null');
    return;
  }
  
  if (!gridObjects || !gridObjects.length) {
    console.warn('Cannot ensure grid visibility: no grid objects provided');
    return;
  }
  
  gridObjects.forEach(obj => {
    if (!obj) return;
    
    try {
      // Try multiple approaches to send to back with fallbacks
      if (typeof obj.sendToBack === 'function') {
        obj.sendToBack();
      } else if (canvas && typeof canvas.sendToBack === 'function') {
        canvas.sendToBack(obj);
      } else if (obj && typeof obj.moveTo === 'function') {
        // Alternative approach using moveTo
        obj.moveTo(0);
      } else if (canvas && typeof canvas.sendObjectToBack === 'function') {
        canvas.sendObjectToBack(obj);
      } else if (canvas && typeof canvas.bringToBack === 'function') {
        canvas.bringToBack(obj);
      } else {
        console.warn('No supported method found to send grid elements to back');
      }
    } catch (error) {
      console.warn('Error ensuring grid element visibility:', error);
      captureError(error instanceof Error ? error : new Error(String(error)), 'grid-visibility');
    }
  });
  
  try {
    canvas.requestRenderAll();
  } catch (error) {
    console.error('Error rendering canvas after grid visibility changes:', error);
    captureError(error instanceof Error ? error : new Error(String(error)), 'grid-render');
  }
};
