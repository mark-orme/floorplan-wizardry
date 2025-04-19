
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Creates a simple grid on the canvas
 * @param canvas - Fabric.js canvas instance
 * @param gridSize - Size of grid cells in pixels
 * @param gridColor - Color of grid lines
 * @returns Array of grid line objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas,
  gridSize: number = 50,
  gridColor: string = '#e0e0e0'
): any[] => {
  const gridObjects: any[] = [];
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Create vertical lines
  for (let i = gridSize; i < canvasWidth; i += gridSize) {
    const line = new Line([i, 0, i, canvasHeight], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      originX: 'center',
      originY: 'center'
    });
    gridObjects.push(line);
    canvas.add(line);
  }

  // Create horizontal lines
  for (let i = gridSize; i < canvasHeight; i += gridSize) {
    const line = new Line([0, i, canvasWidth, i], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5],
      originX: 'center',
      originY: 'center'
    });
    gridObjects.push(line);
    canvas.add(line);
  }

  // Send grid to back
  canvas.requestRenderAll();
  return gridObjects;
};

/**
 * Ensures grid visibility
 * @param canvas - Fabric.js canvas instance
 * @param gridObjects - Array of grid line objects
 * @param visible - Whether grid should be visible
 */
export const ensureGridVisible = (
  canvas: FabricCanvas,
  gridObjects: any[],
  visible: boolean
): void => {
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  canvas.requestRenderAll();
};
