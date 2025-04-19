
/**
 * Simple grid creation utilities for the canvas
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject } from 'fabric';

/**
 * Create a simple grid on the canvas
 * @param canvas Fabric canvas instance
 * @param gridSize Grid cell size in pixels
 * @param gridColor Color of the grid lines
 * @returns Array of fabric objects representing the grid
 */
export function createSimpleGrid(
  canvas: FabricCanvas,
  gridSize: number = 50,
  gridColor: string = '#e0e0e0'
): FabricObject[] {
  const gridObjects: FabricObject[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create vertical lines
  for (let i = 0; i <= width / gridSize; i++) {
    const xPos = i * gridSize;
    const line = new Line([xPos, 0, xPos, height], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5]
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height / gridSize; i++) {
    const yPos = i * gridSize;
    const line = new Line([0, yPos, width, yPos], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 1,
      strokeDashArray: [5, 5]
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Render the grid
  canvas.renderAll();
  
  return gridObjects;
}

/**
 * Ensure grid is visible on the canvas
 * @param canvas Fabric canvas instance
 * @param gridObjects Array of grid objects
 * @returns boolean indicating success
 */
export function ensureGridVisible(
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean {
  try {
    let modified = false;
    
    // Check if any grid objects are invisible
    gridObjects.forEach(obj => {
      if (!obj.visible) {
        obj.set('visible', true);
        modified = true;
      }
    });
    
    // If any objects were modified, render the canvas
    if (modified) {
      canvas.renderAll();
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring grid visibility:', error);
    return false;
  }
}
