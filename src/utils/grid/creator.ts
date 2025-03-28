
/**
 * Grid creator utility
 * Handles the actual creation of grid lines
 * @module grid/creator
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { throttledLog } from "./consoleThrottling";

/**
 * Create a grid on the canvas efficiently
 * Smart implementation that limits grid lines for better performance
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {Object} options - Grid creation options
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createGrid(
  canvas: Canvas,
  options: {
    color?: string;
    width?: number;
    selectable?: boolean;
    type?: string;
  } = {}
): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    return [];
  }
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Default grid options
  const color = options.color || GRID_CONSTANTS.SMALL_GRID_COLOR;
  const lineWidth = options.width || GRID_CONSTANTS.SMALL_GRID_WIDTH;
  const selectable = options.selectable || false;
  const gridType = options.type || 'small';
  
  // Determine spacing based on grid type
  const spacing = gridType === 'small' ? 
    GRID_CONSTANTS.SMALL_GRID : 
    GRID_CONSTANTS.LARGE_GRID;
  
  // Limit number of grid lines for performance (max 100 lines in each direction)
  const maxLines = 100;
  const skipFactor = Math.max(1, Math.ceil((width + height) / (spacing * maxLines)));
  
  // If we're skipping lines, log it for debugging
  if (skipFactor > 1 && process.env.NODE_ENV === 'development') {
    throttledLog(`Grid optimization: Rendering every ${skipFactor}th line for better performance`);
  }
  
  // Create horizontal grid lines
  for (let y = 0; y <= height; y += spacing * skipFactor) {
    const line = new Line([0, y, width, y], {
      stroke: color,
      selectable: selectable,
      evented: false,
      strokeWidth: lineWidth,
      hoverCursor: 'default',
      objectType: 'grid',
      gridType: gridType
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  // Create vertical grid lines
  for (let x = 0; x <= width; x += spacing * skipFactor) {
    const line = new Line([x, 0, x, height], {
      stroke: color,
      selectable: selectable,
      evented: false,
      strokeWidth: lineWidth,
      hoverCursor: 'default',
      objectType: 'grid',
      gridType: gridType
    });
    
    gridObjects.push(line);
    canvas.add(line);
  }
  
  return gridObjects;
}

/**
 * Create small scale grid (fine grid)
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {Object} options - Grid options
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createSmallScaleGrid(
  canvas: Canvas,
  options: {
    color?: string;
    width?: number;
    selectable?: boolean;
    type?: string;
  } = {}
): FabricObject[] {
  return createGrid(canvas, {
    color: options.color || GRID_CONSTANTS.SMALL_GRID_COLOR,
    width: options.width || GRID_CONSTANTS.SMALL_GRID_WIDTH,
    selectable: options.selectable || false,
    type: 'small'
  });
}

/**
 * Create large scale grid (coarse grid)
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {Object} options - Grid options
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createLargeScaleGrid(
  canvas: Canvas,
  options: {
    color?: string;
    width?: number;
    selectable?: boolean;
    type?: string;
  } = {}
): FabricObject[] {
  return createGrid(canvas, {
    color: options.color || GRID_CONSTANTS.LARGE_GRID_COLOR,
    width: options.width || GRID_CONSTANTS.LARGE_GRID_WIDTH,
    selectable: options.selectable || false,
    type: 'large'
  });
}
