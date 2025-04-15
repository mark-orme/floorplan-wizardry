// Add the imported functions here
import { Canvas as FabricCanvas, Point } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';

/**
 * Test canvas drawing capabilities
 * @param canvas The fabric canvas to test
 */
export const testCanvasDrawingCapabilities = (canvas: FabricCanvas): void => {
  try {
    // Basic capability check
    if (!canvas.getObjects || typeof canvas.getObjects !== 'function') {
      throw new Error("Canvas API not properly available");
    }
    
    // Test object creation
    const objectCount = canvas.getObjects().length;
    logger.info("Canvas has objects", { count: objectCount });
    
  } catch (error) {
    logger.error("Error testing canvas drawing capabilities", { error });
    throw error;
  }
};

/**
 * Test straight line drawing functionality
 * @param canvas The fabric canvas
 * @param mode The drawing mode to check
 * @returns Test result information
 */
export const testStraightLineDrawing = (
  canvas: FabricCanvas, 
  mode: DrawingMode
): { success: boolean; message: string; error?: any } => {
  try {
    if (mode !== DrawingMode.STRAIGHT_LINE) {
      return { success: true, message: "Not in straight line mode, test skipped" };
    }
    
    // Check for necessary fabric properties
    const fabric = (window as any).fabric;
    if (!fabric || !fabric.Line) {
      return { success: false, message: "fabric.Line constructor not available" };
    }
    
    // Check canvas state for line drawing
    if (canvas.isDrawingMode) {
      return { success: false, message: "isDrawingMode should be false for straight line tool" };
    }
    
    return { success: true, message: "Straight line capabilities verified" };
  } catch (error) {
    return { 
      success: false, 
      message: "Error testing straight line capabilities", 
      error 
    };
  }
};

/**
 * Converts a point from the canvas coordinate system to the viewport coordinate system.
 * @param {fabric.Point} point - The point in canvas coordinates.
 * @param {fabric.Canvas} canvas - The fabric.js canvas instance.
 * @returns {fabric.Point} The converted point in viewport coordinates.
 */
export const canvasToViewportPoint = (point: Point, canvas: FabricCanvas): Point => {
  const zoom = canvas.getZoom();
  const viewportTransform = canvas.viewportTransform;

  if (!viewportTransform) {
    console.warn("Viewport transform is not available. Returning original point.");
    return point;
  }

  const a = viewportTransform[0];
  const b = viewportTransform[1];
  const c = viewportTransform[2];
  const d = viewportTransform[3];
  const e = viewportTransform[4];
  const f = viewportTransform[5];

  const canvasX = point.x;
  const canvasY = point.y;

  const viewportX = (canvasX * a + canvasY * c + e) / zoom;
  const viewportY = (canvasX * b + canvasY * d + f) / zoom;

  return new Point(viewportX, viewportY);
};

/**
 * Converts a point from the viewport coordinate system to the canvas coordinate system.
 *
 * @param {fabric.Point} point - The point in viewport coordinates.
 * @param {fabric.Canvas} canvas - The fabric.js canvas instance.
 * @returns {fabric.Point} The converted point in canvas coordinates.
 */
export const viewportToCanvasPoint = (point: Point, canvas: FabricCanvas): Point => {
  const zoom = canvas.getZoom();
  const viewportTransform = canvas.viewportTransform;

  if (!viewportTransform) {
    console.warn("Viewport transform is not available. Returning original point.");
    return point;
  }

  const a = viewportTransform[0];
  const b = viewportTransform[1];
  const c = viewportTransform[2];
  const d = viewportTransform[3];
  const e = viewportTransform[4];
  const f = viewportTransform[5];

  const viewportX = point.x;
  const viewportY = point.y;

  const canvasX = (viewportX - e / zoom) / a;
  const canvasY = (viewportY - f / zoom) / d;

  return new Point(canvasX, canvasY);
};
