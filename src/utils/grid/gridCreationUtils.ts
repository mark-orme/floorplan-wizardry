
/**
 * Grid creation utilities
 * Functions for creating and validating grids
 */
import { Canvas, Object as FabricObject } from 'fabric';
import { createLine } from '@/utils/fabric/fabricAdapter';

/**
 * Create a complete grid on the canvas
 * @param canvas The fabric canvas
 * @param gridSize The size of the grid cells
 * @param options Additional options for the grid
 * @returns The grid objects created
 */
export function createCompleteGrid(
  canvas: Canvas | null,
  gridSize: number = 20,
  options: any = {}
): FabricObject[] {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  const { width, height } = canvas;
  const gridColor = options.color || '#cccccc';
  const gridOpacity = options.opacity || 0.5;
  
  // Create grid lines
  for (let x = 0; x <= width; x += gridSize) {
    const line = createLine([x, 0, x, height], {
      stroke: gridColor,
      strokeWidth: 1,
      opacity: gridOpacity,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true
    });
    
    if (line) {
      canvas.add(line);
      gridObjects.push(line);
    }
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    const line = createLine([0, y, width, y], {
      stroke: gridColor,
      strokeWidth: 1,
      opacity: gridOpacity,
      selectable: false,
      evented: false,
      objectType: 'grid',
      excludeFromExport: true
    });
    
    if (line) {
      canvas.add(line);
      gridObjects.push(line);
    }
  }
  
  return gridObjects;
}

/**
 * Create a basic emergency grid when the full grid fails
 * @param canvas The fabric canvas
 * @returns The emergency grid objects created
 */
export function createBasicEmergencyGrid(canvas: Canvas | null): FabricObject[] {
  if (!canvas) return [];
  
  const emergencyGridObjects: FabricObject[] = [];
  const { width, height } = canvas;
  
  // Create a simpler grid with fewer lines
  const intervals = [width/2, height/2];
  
  // Vertical center line
  const verticalLine = createLine([width/2, 0, width/2, height], {
    stroke: '#ff0000',
    strokeWidth: 1,
    opacity: 0.7,
    selectable: false,
    evented: false,
    objectType: 'emergency-grid'
  });
  
  if (verticalLine) {
    canvas.add(verticalLine);
    emergencyGridObjects.push(verticalLine);
  }
  
  // Horizontal center line
  const horizontalLine = createLine([0, height/2, width, height/2], {
    stroke: '#ff0000',
    strokeWidth: 1,
    opacity: 0.7,
    selectable: false,
    evented: false,
    objectType: 'emergency-grid'
  });
  
  if (horizontalLine) {
    canvas.add(horizontalLine);
    emergencyGridObjects.push(horizontalLine);
  }
  
  return emergencyGridObjects;
}

/**
 * Validate that the grid is properly set up
 * @param canvas The fabric canvas
 * @param gridObjects The grid objects to validate
 * @returns Whether the grid is valid
 */
export function validateGrid(canvas: Canvas | null, gridObjects: FabricObject[]): boolean {
  if (!canvas) return false;
  
  // Check if there are any grid objects
  if (!gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if all grid objects exist on the canvas
  for (const gridObject of gridObjects) {
    if (!canvas.contains(gridObject)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Create a grid with the given grid size
 * @param canvas The fabric canvas
 * @param gridSize The size of the grid cells
 * @param color The color of the grid lines
 * @returns The grid objects created
 */
export function createGrid(
  canvas: Canvas,
  gridSize: number = 20,
  color: string = '#cccccc'
): FabricObject[] {
  return createCompleteGrid(canvas, gridSize, { color });
}
