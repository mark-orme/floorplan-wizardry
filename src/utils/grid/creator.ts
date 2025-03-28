
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

/**
 * Create grid layer with current canvas dimensions
 * Creates both small and large grid lines
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {React.Dispatch<React.SetStateAction<any>>} setDebugInfo - Function to update debug info
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createGridLayer(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<any>>
): FabricObject[] {
  try {
    // Clear any existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create small grid (lighter, thinner lines)
    const smallGridObjects = createSmallScaleGrid(canvas);
    
    // Create large grid (darker, thicker lines)
    const largeGridObjects = createLargeScaleGrid(canvas);
    
    // Combine all grid objects
    const gridObjects = [...smallGridObjects, ...largeGridObjects];
    
    // Store created objects in the reference
    gridLayerRef.current = gridObjects;
    
    // Update debug info if provided
    if (setDebugInfo) {
      setDebugInfo((prev: any) => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridObjects.length
      }));
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid layer:", error);
    return [];
  }
}

/**
 * Create a basic fallback grid when standard grid creation fails
 * Much simpler grid with fewer lines to reduce performance impact
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @param {React.Dispatch<React.SetStateAction<any>>} setDebugInfo - Function to update debug info
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createFallbackGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  setDebugInfo: React.Dispatch<React.SetStateAction<any>>
): FabricObject[] {
  try {
    // Clear existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Use a larger spacing for fallback grid to reduce number of objects
    const gridSpacing = 50;
    const gridColor = '#e0e0e0';
    
    // Create only the large grid lines for better performance
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default',
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default',
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Store created objects
    gridLayerRef.current = gridObjects;
    
    // Update debug info if provided
    if (setDebugInfo) {
      setDebugInfo((prev: any) => ({
        ...prev,
        gridCreated: true,
        gridObjectCount: gridObjects.length,
        usingFallbackGrid: true
      }));
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating fallback grid:", error);
    return [];
  }
}
