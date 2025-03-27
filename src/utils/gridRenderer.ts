
/**
 * Grid rendering utilities
 * Provides functions to render grid components on canvas
 * @module gridRenderer
 */
import { Canvas as FabricCanvas, Line as FabricLine, Object as FabricObject } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Result of grid rendering operation
 */
export interface GridRenderResult {
  /** Created grid lines */
  gridLines: FabricObject[];
  /** Small grid lines */
  smallGridLines: FabricLine[];
  /** Large grid lines */
  largeGridLines: FabricLine[];
  /** Small grid extent */
  smallGridExtent: { rows: number; cols: number };
  /** Large grid extent */
  largeGridExtent: { rows: number; cols: number };
}

/**
 * Creates all grid components and adds them to canvas
 * @param canvas - The Fabric.js canvas instance
 * @param options - Optional rendering options
 * @returns Array of created grid objects
 */
export const renderGridComponents = (
  canvas: FabricCanvas,
  options?: {
    addToCanvas?: boolean;
    smallGridColor?: string;
    largeGridColor?: string;
  }
): GridRenderResult => {
  if (!canvas) {
    throw new Error("Canvas is required for grid rendering");
  }

  const addToCanvas = options?.addToCanvas ?? true;
  const smallGridColor = options?.smallGridColor ?? GRID_CONSTANTS.SMALL_GRID_COLOR;
  const largeGridColor = options?.largeGridColor ?? GRID_CONSTANTS.LARGE_GRID_COLOR;
  
  // Create grid container
  const gridLines: FabricObject[] = [];
  const smallGridLines: FabricLine[] = [];
  const largeGridLines: FabricLine[] = [];
  
  // Get dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Calculate grid extents
  const smallGridExtent = {
    rows: Math.ceil(height / GRID_CONSTANTS.SMALL_GRID),
    cols: Math.ceil(width / GRID_CONSTANTS.SMALL_GRID)
  };
  
  const largeGridExtent = {
    rows: Math.ceil(height / GRID_CONSTANTS.LARGE_GRID),
    cols: Math.ceil(width / GRID_CONSTANTS.LARGE_GRID)
  };
  
  // Create small grid lines
  for (let i = 0; i <= smallGridExtent.rows; i++) {
    const y = i * GRID_CONSTANTS.SMALL_GRID;
    
    // Skip if aligns with large grid
    if (i % (GRID_CONSTANTS.LARGE_GRID / GRID_CONSTANTS.SMALL_GRID) !== 0) {
      const line = new FabricLine([0, y, width, y], {
        stroke: smallGridColor,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-small-horizontal'
      });
      
      smallGridLines.push(line);
      gridLines.push(line);
      
      if (addToCanvas) {
        canvas.add(line);
      }
    }
  }
  
  for (let i = 0; i <= smallGridExtent.cols; i++) {
    const x = i * GRID_CONSTANTS.SMALL_GRID;
    
    // Skip if aligns with large grid
    if (i % (GRID_CONSTANTS.LARGE_GRID / GRID_CONSTANTS.SMALL_GRID) !== 0) {
      const line = new FabricLine([x, 0, x, height], {
        stroke: smallGridColor,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid-small-vertical'
      });
      
      smallGridLines.push(line);
      gridLines.push(line);
      
      if (addToCanvas) {
        canvas.add(line);
      }
    }
  }
  
  // Create large grid lines
  for (let i = 0; i <= largeGridExtent.rows; i++) {
    const y = i * GRID_CONSTANTS.LARGE_GRID;
    
    const line = new FabricLine([0, y, width, y], {
      stroke: largeGridColor,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid-large-horizontal'
    });
    
    largeGridLines.push(line);
    gridLines.push(line);
    
    if (addToCanvas) {
      canvas.add(line);
    }
  }
  
  for (let i = 0; i <= largeGridExtent.cols; i++) {
    const x = i * GRID_CONSTANTS.LARGE_GRID;
    
    const line = new FabricLine([x, 0, x, height], {
      stroke: largeGridColor,
      strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
      selectable: false,
      evented: false,
      objectType: 'grid-large-vertical'
    });
    
    largeGridLines.push(line);
    gridLines.push(line);
    
    if (addToCanvas) {
      canvas.add(line);
    }
  }
  
  return {
    gridLines,
    smallGridLines,
    largeGridLines,
    smallGridExtent,
    largeGridExtent
  };
};

/**
 * Arranges grid objects in the correct stacking order
 * @param canvas - The Fabric.js canvas instance
 * @param gridObjects - Grid objects to arrange
 * @returns The arranged grid objects
 */
export const arrangeGridObjects = (
  canvas: FabricCanvas, 
  gridObjects: FabricObject[]
): FabricObject[] => {
  if (!canvas || !gridObjects.length) return gridObjects;
  
  // Ensure grid objects are sent to the back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  return gridObjects;
};
