
/**
 * Canvas grid utilities
 * @module utils/canvasGrid
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Grid options interface
 */
export interface GridOptions {
  /** Grid size in pixels */
  size?: number;
  /** Grid stroke color */
  stroke?: string;
  /** Grid stroke width */
  strokeWidth?: number;
  /** Whether to show major lines */
  showMajorLines?: boolean;
  /** Major line stroke color */
  majorStroke?: string;
  /** Major line stroke width */
  majorStrokeWidth?: number;
  /** Major line interval */
  majorInterval?: number;
  /** Enable debug mode */
  debug?: boolean;
}

/**
 * Default grid options
 */
export const DEFAULT_GRID_OPTIONS: GridOptions = {
  size: 20,
  stroke: "#e0e0e0",
  strokeWidth: 1,
  showMajorLines: true,
  majorStroke: "#c0c0c0",
  majorStrokeWidth: 1,
  majorInterval: 5
};

/**
 * Create a grid on the canvas
 * 
 * @param {FabricCanvas} canvas - The fabric.js canvas instance
 * @param {GridOptions} options - Grid options
 * @returns {FabricObject[]} Created grid objects
 */
export const createGrid = (
  canvas: FabricCanvas,
  options: GridOptions = {}
): FabricObject[] => {
  // Merge default options with provided options
  const gridOptions = { ...DEFAULT_GRID_OPTIONS, ...options };
  
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("Invalid canvas for grid creation");
    return [];
  }
  
  // Remove any existing grid objects
  const existingGridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );
  
  if (existingGridObjects.length > 0) {
    existingGridObjects.forEach(obj => {
      canvas.remove(obj);
    });
  }
  
  const gridObjects: FabricObject[] = [];
  const { 
    size, 
    stroke, 
    strokeWidth, 
    showMajorLines, 
    majorStroke, 
    majorStrokeWidth,
    majorInterval
  } = gridOptions;
  
  // Calculate grid dimensions
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal grid lines
  for (let i = 0; i <= height; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([0, i, width, i], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectCaching: false,
      objectType: 'grid',
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= width; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([i, 0, i, height], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectCaching: false,
      objectType: 'grid',
      hoverCursor: 'default'
    } as any);
    
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }
  
  // Render the canvas to show grid
  if (gridOptions.debug) {
    console.log(`Created grid with ${gridObjects.length} objects`);
  }
  
  canvas.renderAll();
  return gridObjects;
};

/**
 * Check if an object is a grid element
 * @param obj - Fabric object to check
 */
export const isGridObject = (obj: FabricObject): boolean => {
  return (obj as any).objectType === 'grid';
};

/**
 * Toggle grid visibility
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 */
export const toggleGridVisibility = (canvas: FabricCanvas, visible: boolean): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => isGridObject(obj));
  
  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });
  
  canvas.requestRenderAll();
};

/**
 * Ensure grid is visible after operations like zoom/pan
 * @param canvas - Fabric canvas
 */
export const ensureGridVisibility = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  const gridObjects = canvas.getObjects().filter(obj => isGridObject(obj));
  
  // Send all grid objects to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.requestRenderAll();
};
