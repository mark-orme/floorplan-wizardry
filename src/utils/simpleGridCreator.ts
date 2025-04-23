
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Creates a simple grid for canvas
 * @param canvas - The canvas to create grid for
 * @param gridSize - Size of grid cells
 * @param color - Color of grid lines
 * @returns Array of grid line objects
 */
export function createSimpleGrid(canvas: FabricCanvas, gridSize: number = 50, color: string = '#e0e0e0'): any[] {
  if (!canvas) return [];
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects = [];
  
  // Create vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    const line = new Line([i, 0, i, height], {
      stroke: color,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      opacity: 0.5,
      objectCaching: false
    });
    
    gridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    const line = new Line([0, i, width, i], {
      stroke: color,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      opacity: 0.5,
      objectCaching: false
    });
    
    gridObjects.push(line);
  }
  
  return gridObjects;
}

/**
 * Ensures grid is visible on canvas
 * @param canvas - The canvas containing grid
 * @param gridObjects - Array of grid objects
 */
export function ensureGridVisible(canvas: FabricCanvas, gridObjects: any[]): void {
  if (!canvas || !gridObjects.length) return;
  
  gridObjects.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
    }
    canvas.sendToBack(obj);
  });
  
  canvas.requestRenderAll();
}
