
/**
 * Grid utilities
 * @module utils/gridUtils
 */
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Grid dimensions interface
 */
interface GridDimensions {
  width: number;
  height: number;
  cellSize: number;
}

/**
 * Helper to check if an object is a grid object
 * @param obj The object to check
 * @returns True if the object is a grid object
 */
export function isGridObject(obj: FabricObject): boolean {
  return obj && (obj as any).objectType === 'grid';
}

/**
 * Calculate grid dimensions based on canvas size
 * @param width Canvas width
 * @param height Canvas height
 * @param cellSize Optional cell size
 * @returns Grid dimensions
 */
export function calculateGridDimensions(
  width: number,
  height: number,
  cellSize: number = 20
): GridDimensions {
  return {
    width,
    height,
    cellSize
  };
}

/**
 * Calculate the appropriate grid spacing based on zoom level
 * @param zoomLevel Current zoom level of the canvas
 * @returns The appropriate grid spacing for the current zoom
 */
export function calculateGridSpacing(zoomLevel: number = 1): number {
  // Base small grid size
  const baseSmallGrid = typeof GRID_SPACING === 'number' ? GRID_SPACING : GRID_SPACING.DEFAULT;
  
  // Adjust grid size based on zoom level
  if (zoomLevel < 0.5) {
    return baseSmallGrid * 4; // Use larger spacing when zoomed out
  } else if (zoomLevel < 0.8) {
    return baseSmallGrid * 2; // Use medium spacing at medium zoom
  }
  
  // Return default spacing for normal zoom
  return baseSmallGrid;
}

/**
 * Create grid lines on the canvas
 * @param canvas The canvas
 * @param dimensions Grid dimensions
 * @returns Array of created grid objects
 */
export function createGridLines(
  canvas: Canvas,
  dimensions: GridDimensions
): FabricObject[] {
  if (!canvas) return [];
  
  const { width, height, cellSize } = dimensions;
  const gridObjects: FabricObject[] = [];
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += cellSize) {
    const line = new Line([0, i, width, i], {
      stroke: '#cccccc',
      strokeWidth: i % 100 === 0 ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let i = 0; i <= width; i += cellSize) {
    const line = new Line([i, 0, i, height], {
      stroke: '#cccccc',
      strokeWidth: i % 100 === 0 ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  return gridObjects;
}

/**
 * Create a complete grid with all components
 * @param canvas The canvas
 * @param width Canvas width (optional, defaults to canvas width)
 * @param height Canvas height (optional, defaults to canvas height)
 * @param cellSize Grid cell size (optional, defaults to 20)
 * @returns Grid render result
 */
export function createCompleteGrid(
  canvas: Canvas,
  width?: number,
  height?: number,
  cellSize: number = 20
): {
  gridObjects: FabricObject[];
  smallGridLines: FabricObject[];
  largeGridLines: FabricObject[];
  markers: FabricObject[];
} {
  // Use provided dimensions or get from canvas
  const canvasWidth = width || canvas.width || 800;
  const canvasHeight = height || canvas.height || 600;
  
  // Calculate grid dimensions
  const dimensions = calculateGridDimensions(canvasWidth, canvasHeight, cellSize);
  
  // Create grid objects
  const gridObjects = createGridLines(canvas, dimensions);
  
  // Separating lines into small and large grid lines
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  
  gridObjects.forEach(obj => {
    // Cast to Line to check strokeWidth safely
    const line = obj as Line;
    if (line.strokeWidth && line.strokeWidth > 0.5) {
      largeGridLines.push(obj);
    } else {
      smallGridLines.push(obj);
    }
  });
  
  // Return the grid components
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers: [] // Empty for now
  };
}

/**
 * Set visibility of grid objects
 * @param canvas The canvas
 * @param gridObjects The grid objects to modify
 * @param visible Whether grid should be visible
 */
export function setGridVisibility(
  canvas: Canvas, 
  gridObjects: FabricObject[], 
  visible: boolean
): void {
  if (!canvas) return;
  
  gridObjects.forEach((obj: FabricObject) => {
    obj.set({ visible });
  });
  
  canvas.requestRenderAll();
}

/**
 * Render grid components
 * @param canvas The canvas
 * @param width Canvas width
 * @param height Canvas height
 * @returns The rendered grid components
 */
export function renderGridComponents(
  canvas: Canvas,
  width: number,
  height: number
) {
  // Use GRID_SPACING as the cell size
  const cellSize = typeof GRID_SPACING === 'number' ? GRID_SPACING : GRID_SPACING.DEFAULT;
  
  return createCompleteGrid(canvas, width, height, cellSize);
}

/**
 * Check if a grid exists on the canvas
 * @param canvas The canvas
 * @returns True if grid exists
 */
export function hasExistingGrid(canvas: Canvas): boolean {
  if (!canvas) return false;
  
  const objects = canvas.getObjects();
  return objects.some((obj: FabricObject) => (obj as any).objectType === 'grid');
}

/**
 * Remove grid objects from canvas
 * @param canvas The canvas
 * @param gridObjects Optional array of grid objects to remove
 */
export function removeGrid(canvas: Canvas, gridObjects?: FabricObject[]): void {
  if (!canvas) return;
  
  const objectsToRemove = gridObjects || 
    canvas.getObjects().filter((obj: FabricObject) => isGridObject(obj));
  
  objectsToRemove.forEach((obj: FabricObject) => {
    canvas.remove(obj);
  });
  
  canvas.requestRenderAll();
}

/**
 * Filter grid objects from canvas objects
 * @param objects Array of canvas objects
 * @returns Non-grid objects
 */
export function filterGridObjects(objects: FabricObject[]): FabricObject[] {
  return objects.filter(obj => !isGridObject(obj));
}

/**
 * Get the nearest grid point to a given point
 * @param point The reference point
 * @param gridSize Grid size to snap to
 * @returns The nearest grid point
 */
export function getNearestGridPoint(
  point: { x: number, y: number } | null, 
  gridSize: number
): { x: number, y: number } {
  if (!point) return { x: 0, y: 0 };
  
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}
