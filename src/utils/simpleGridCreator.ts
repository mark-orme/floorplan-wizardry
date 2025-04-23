
/**
 * Utility for creating grid lines on canvas
 * Provides robust error handling and compatibility with different Fabric.js versions
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { captureError } from '@/utils/sentryUtils';
import { safeSendToBack, captureRenderingError } from '@/utils/canvas/fabricErrorMonitoring';

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
        
        // Use our safe method to send to back
        safeSendToBack(line, canvas);
      } catch (error) {
        console.error("Error creating vertical grid line:", error);
        captureError(error instanceof Error ? error : new Error(String(error)), {
          tags: { component: "grid-creation" },
          context: { position: i, type: "vertical" }
        });
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
        
        // Use our safe method to send to back
        safeSendToBack(line, canvas);
      } catch (error) {
        console.error("Error creating horizontal grid line:", error);
        captureError(error instanceof Error ? error : new Error(String(error)), {
          tags: { component: "grid-creation" },
          context: { position: i, type: "horizontal" }
        });
      }
    }

    try {
      canvas.renderAll();
    } catch (error) {
      captureRenderingError(canvas, "grid-rendering", error);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Fatal error creating grid:", error);
    captureError(error instanceof Error ? error : new Error(String(error)), {
      tags: { component: "grid-fatal" },
      level: 'error'
    });
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
    
    // Use our safe send to back method
    safeSendToBack(obj, canvas);
  });
  
  try {
    if (typeof canvas.requestRenderAll === 'function') {
      canvas.requestRenderAll();
    } else if (typeof canvas.renderAll === 'function') {
      canvas.renderAll();
    }
  } catch (error) {
    captureRenderingError(canvas, "grid-visibility", error);
  }
};
