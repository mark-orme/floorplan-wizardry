
/**
 * Utility for creating grid lines on canvas
 */
import { Canvas as FabricCanvas, Line } from 'fabric';

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
  console.log("Creating grid - placeholder implementation");
  
  if (!canvas) return [];

  const gridObjects: any[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();

  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
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
    if (canvas.bringToBack && typeof canvas.bringToBack === 'function') {
      canvas.bringToBack(line);
    }
  }

  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
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
    if (canvas.bringToBack && typeof canvas.bringToBack === 'function') {
      canvas.bringToBack(line);
    }
  }

  canvas.renderAll();
  return gridObjects;
};

/**
 * Ensures grid is visible by bringing it to the back
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Array of grid line objects
 */
export const ensureGridVisible = (
  canvas: FabricCanvas,
  gridObjects: any[]
): void => {
  if (!canvas || !gridObjects.length) return;
  
  gridObjects.forEach(obj => {
    // Check if obj and the method both exist
    if (obj && typeof obj.sendToBack === 'function') {
      obj.sendToBack();
    } else if (canvas && typeof canvas.sendToBack === 'function') {
      // Try to use canvas method instead
      canvas.sendToBack(obj);
    }
  });
  
  canvas.renderAll();
};
