
import { Point as FabricPoint } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Converts a simple {x, y} point to a Fabric.js Point
 * This is necessary because Fabric expects its own Point object for certain operations
 * 
 * @param point A simple point with x and y coordinates
 * @returns A Fabric.js Point object
 */
export const toFabricPoint = (point: { x: number; y: number }): FabricPoint => {
  return new FabricPoint(point.x, point.y);
};

/**
 * Tests if a canvas has drawing capabilities properly set up
 * Use this for debugging canvas issues
 * 
 * @param canvas The Fabric.js canvas to test
 */
export const testCanvasDrawingCapabilities = (canvas: any): void => {
  if (!canvas) {
    console.error("Canvas is null or undefined");
    return;
  }
  
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
  console.log("Canvas drawing mode:", canvas.isDrawingMode);
  console.log("Canvas selection enabled:", canvas.selection);
  console.log("Canvas object count:", canvas.getObjects().length);
  
  try {
    // Try to add a test line
    const line = new fabric.Line([50, 50, 200, 200], {
      stroke: 'red',
      strokeWidth: 5
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    console.log("Test line added successfully");
    
    // Remove the test line after 2 seconds
    setTimeout(() => {
      canvas.remove(line);
      canvas.renderAll();
      console.log("Test line removed");
    }, 2000);
  } catch (error) {
    console.error("Failed to add test line:", error);
  }
};
