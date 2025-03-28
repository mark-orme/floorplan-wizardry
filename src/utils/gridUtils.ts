
/**
 * Grid utility functions
 * @module utils/gridUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import { GRID_SPACING } from "@/constants/numerics";
import { Point } from "@/types/core/Point";

/**
 * Check if the canvas has an existing grid
 * @param canvas - The Fabric canvas
 * @returns Whether the canvas has a grid
 */
export const hasExistingGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  return canvas.getObjects().some((obj) => obj.objectType === 'grid');
};

/**
 * Remove all grid objects from the canvas
 * @param canvas - The Fabric canvas
 * @returns Array of removed grid objects
 */
export const removeGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  const gridObjects = canvas.getObjects().filter((obj) => obj.objectType === 'grid');
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Set the visibility of the grid
 * @param canvas - The Fabric canvas
 * @param visible - Whether the grid should be visible
 */
export const setGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter((obj) => obj.objectType === 'grid');
  
  gridObjects.forEach(obj => {
    obj.visible = visible;
  });
  
  canvas.renderAll();
};

/**
 * Filter grid objects from an array of objects
 * @param objects - Array of Fabric objects
 * @returns Array of grid objects
 */
export const filterGridObjects = (objects: FabricObject[]): FabricObject[] => {
  return objects.filter(obj => obj.objectType === 'grid');
};

/**
 * Get the nearest grid point to a given point
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns The nearest grid point
 */
export const getNearestGridPoint = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Get the nearest grid intersection
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns The nearest grid intersection
 */
export const getNearestGridIntersection = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return getNearestGridPoint(point, gridSize);
};

/**
 * Calculate distance to nearest grid line
 * @param point - The reference point
 * @param gridSize - The grid size
 * @returns Object with distances to nearest horizontal and vertical grid lines
 */
export const distanceToNearestGridLine = (point: Point, gridSize: number = GRID_SPACING.SMALL): { x: number, y: number } => {
  const nearestX = Math.round(point.x / gridSize) * gridSize;
  const nearestY = Math.round(point.y / gridSize) * gridSize;
  
  return {
    x: Math.abs(point.x - nearestX),
    y: Math.abs(point.y - nearestY)
  };
};

/**
 * Calculate grid dimensions
 * @param width - Canvas width
 * @param height - Canvas height
 * @param cellSize - Optional cell size
 * @returns Grid dimensions object
 */
export const calculateGridDimensions = (width: number, height: number, cellSize: number = 20) => {
  return {
    width,
    height,
    cellSize
  };
};

/**
 * Create grid lines
 * @param canvas - The Fabric canvas
 * @param dimensions - Grid dimensions
 * @returns Created grid objects
 */
export const createGridLines = (canvas: FabricCanvas, dimensions: { width: number, height: number, cellSize: number }): FabricObject[] => {
  const { width, height, cellSize } = dimensions;
  const gridObjects: FabricObject[] = [];
  
  // Create vertical lines
  for (let x = 0; x <= width; x += cellSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += cellSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  return gridObjects;
};

/**
 * Create a complete grid on the canvas
 * @param canvas - The Fabric canvas
 * @param width - Grid width
 * @param height - Grid height
 * @param cellSize - Grid cell size
 * @returns Grid render result
 */
export const createCompleteGrid = (canvas: FabricCanvas, width: number = 800, height: number = 600, cellSize: number = 20) => {
  const smallGridLines: FabricObject[] = [];
  const largeGridLines: FabricObject[] = [];
  const markers: FabricObject[] = [];
  
  // Create small grid (cellSize)
  for (let x = 0; x <= width; x += cellSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    smallGridLines.push(line);
  }
  
  for (let y = 0; y <= height; y += cellSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    smallGridLines.push(line);
  }
  
  // Create large grid (5x cellSize)
  const largeGridSize = cellSize * 5;
  for (let x = 0; x <= width; x += largeGridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#b0b0b0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    largeGridLines.push(line);
  }
  
  for (let y = 0; y <= height; y += largeGridSize) {
    const line = new Line([0, y, width, y], {
      stroke: '#b0b0b0',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(line);
    largeGridLines.push(line);
  }
  
  // Create grid markers
  for (let x = largeGridSize; x < width; x += largeGridSize) {
    const text = new Text(String(x), {
      left: x,
      top: 5,
      fontSize: 10,
      fill: '#808080',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(text);
    markers.push(text);
  }
  
  for (let y = largeGridSize; y < height; y += largeGridSize) {
    const text = new Text(String(y), {
      left: 5,
      top: y,
      fontSize: 10,
      fill: '#808080',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    canvas.add(text);
    markers.push(text);
  }
  
  // Combine all grid objects
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  // Render all changes
  canvas.renderAll();
  
  return {
    gridObjects,
    smallGridLines,
    largeGridLines,
    markers
  };
};

/**
 * Check if an object is a grid element
 * @param obj - Fabric object to check
 * @returns Whether the object is a grid element
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return obj.objectType === 'grid';
};

/**
 * Snap a point to the nearest grid position
 * @param point - Point to snap
 * @param gridSize - Grid size
 * @returns Snapped point
 */
export const snapToGrid = (point: Point, gridSize: number = GRID_SPACING.SMALL): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
};

/**
 * Snap a line to standard angles (0, 45, 90, etc.)
 * @param startPoint - Line start point
 * @param endPoint - Line end point
 * @returns Adjusted end point for snapped line
 */
export const snapLineToStandardAngles = (startPoint: Point, endPoint: Point): Point => {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const angle = Math.atan2(dy, dx);
  
  // Snap to 0, 45, 90, 135, 180, 225, 270, 315 degrees
  const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
  
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    x: startPoint.x + distance * Math.cos(snapAngle),
    y: startPoint.y + distance * Math.sin(snapAngle)
  };
};
