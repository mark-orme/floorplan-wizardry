
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
    const line = new FabricPoint(50, 50);
    console.log("Test point created", line);
    
    // Test if drawing tools are working
    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      console.log("Drawing brush:", {
        width: canvas.freeDrawingBrush.width,
        color: canvas.freeDrawingBrush.color,
        type: canvas.freeDrawingBrush.type
      });
    }
    
    // Log active tool if available
    if (canvas._activeObject) {
      console.log("Active object:", canvas._activeObject.type);
    }
  } catch (error) {
    console.error("Failed during canvas test:", error);
  }
};

/**
 * Verifies straight line drawing functionality
 * 
 * @param canvas The Fabric.js canvas to test
 */
export const testStraightLineDrawing = (canvas: any): void => {
  if (!canvas) {
    console.error("Canvas is null or undefined");
    return;
  }
  
  try {
    // Test if the canvas can create and add a line
    const testLine = new fabric.Line([50, 50, 200, 200], {
      stroke: 'red',
      strokeWidth: 5
    });
    
    canvas.add(testLine);
    canvas.renderAll();
    
    console.log("Test line added successfully");
    
    // Remove the test line after 1 second
    setTimeout(() => {
      canvas.remove(testLine);
      canvas.renderAll();
      console.log("Test line removed");
    }, 1000);
    
    // Return test result
    return { success: true, message: "Line test successful" };
  } catch (error) {
    console.error("Failed to test straight line:", error);
    return { success: false, message: "Line test failed", error };
  }
};
