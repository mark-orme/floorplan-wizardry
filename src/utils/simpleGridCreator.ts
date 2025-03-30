
import { Canvas as FabricCanvas, Line, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { Point } from "@/types/core/Point";

/**
 * Creates a simple grid on the canvas
 * 
 * @param {FabricCanvas} canvas - The canvas to draw the grid on
 * @param {FabricObject[]} existingGrid - Any existing grid objects to clear first
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createSimpleGrid = (
  canvas: FabricCanvas, 
  existingGrid: FabricObject[] = []
): FabricObject[] => {
  if (!canvas || typeof canvas.getWidth !== 'function') {
    console.error("Invalid canvas provided to createSimpleGrid");
    return [];
  }
  
  try {
    // Get canvas dimensions
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    if (!width || !height || width <= 0 || height <= 0) {
      console.error("Invalid canvas dimensions", { width, height });
      return [];
    }
    
    console.log("Creating simple grid with dimensions:", width, "x", height);
    
    // Clear existing grid objects if provided
    if (existingGrid && existingGrid.length > 0) {
      existingGrid.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    }
    
    const gridObjects: FabricObject[] = [];
    const smallGridSize = 20; // Small grid size in pixels
    const largeGridSize = 100; // Large grid size in pixels
    
    // Create small grid lines
    for (let y = 0; y <= height; y += smallGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: '#e5e5e5',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties
      (line as any).objectType = 'grid';
      (line as any).gridType = 'small';
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += smallGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e5e5e5',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties
      (line as any).objectType = 'grid';
      (line as any).gridType = 'small';
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let y = 0; y <= height; y += largeGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties
      (line as any).objectType = 'grid';
      (line as any).gridType = 'large';
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let x = 0; x <= width; x += largeGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: '#cccccc',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      // Add custom properties
      (line as any).objectType = 'grid';
      (line as any).gridType = 'large';
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Force render to ensure grid is visible
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Snaps a point to the nearest grid intersection
 * 
 * @param {Point} point - The point to snap
 * @param {number} gridSize - The grid size to snap to (default: small grid)
 * @returns {Point} The snapped point
 */
export const snapPointToGrid = (point: Point, gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE): Point => {
  if (!point) return { x: 0, y: 0 };
  
  const x = Math.round(point.x / gridSize) * gridSize;
  const y = Math.round(point.y / gridSize) * gridSize;
  
  return { x, y };
};

/**
 * Ensure grid is visible
 * 
 * @param {FabricCanvas} canvas - The canvas
 * @param {FabricObject[]} gridObjects - The grid objects
 * @returns {boolean} Whether any fixes were applied
 */
export const ensureGridVisible = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas || !gridObjects || gridObjects.length === 0) return false;
  
  let fixesApplied = false;
  
  try {
    // Check if grid objects are on canvas and visible
    gridObjects.forEach(obj => {
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        fixesApplied = true;
      }
      
      if (!obj.visible) {
        obj.visible = true;
        fixesApplied = true;
      }
    });
    
    // Force render if fixes were applied
    if (fixesApplied) {
      canvas.requestRenderAll();
    }
  } catch (error) {
    console.error("Error ensuring grid visibility:", error);
  }
  
  return fixesApplied;
};

/**
 * Force grid recreation
 * 
 * @param {FabricCanvas} canvas - The canvas
 * @param {FabricObject[]} existingGrid - Existing grid objects
 * @returns {FabricObject[]} New grid objects
 */
export const forceGridRecreation = (
  canvas: FabricCanvas,
  existingGrid: FabricObject[] = []
): FabricObject[] => {
  console.log("Forcing grid recreation");
  return createSimpleGrid(canvas, existingGrid);
};
