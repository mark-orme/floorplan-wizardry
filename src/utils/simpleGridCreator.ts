
/**
 * Simple grid creator utility
 * Creates and manages grid lines for the canvas
 * @module utils/simpleGridCreator
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import { toast } from "sonner";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

// Default spacing constants
const DEFAULT_SMALL_GRID_SIZE = GRID_CONSTANTS.SMALL_GRID_SIZE || 10;
const DEFAULT_LARGE_GRID_SIZE = GRID_CONSTANTS.LARGE_GRID_SIZE || 50;

/**
 * Create a simple grid on the canvas
 * @param {Canvas} canvas - The canvas to create grid on
 * @param {FabricObject[]} existingGridObjects - Existing grid objects (if any)
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createSimpleGrid(
  canvas: Canvas, 
  existingGridObjects: FabricObject[] = []
): FabricObject[] {
  try {
    console.log("Creating simple grid with canvas dimensions:", canvas.width, canvas.height);
    
    // Validation - skip if dimensions are invalid
    if (!canvas || !canvas.width || !canvas.height) {
      console.error("Cannot create grid: Invalid canvas dimensions", { 
        hasCanvas: !!canvas,
        width: canvas?.width, 
        height: canvas?.height 
      });
      return [];
    }
    
    // Remove existing grid objects
    if (existingGridObjects.length > 0) {
      existingGridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    }
    
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 1000;
    const height = canvas.height || 800;
    
    console.log(`Creating grid for canvas: ${width}x${height}`);
    
    // Create small grid lines
    const smallGridSize = DEFAULT_SMALL_GRID_SIZE;
    const largeGridSize = DEFAULT_LARGE_GRID_SIZE;
    
    // Determine grid density - limit number of lines for very large canvases
    const MAX_LINES = 200; // Maximum number of grid lines to create
    let smallGridDensity = 1; // Draw every Nth line
    
    // Calculate density to avoid too many lines
    if (width > smallGridSize * MAX_LINES || height > smallGridSize * MAX_LINES) {
      smallGridDensity = Math.ceil(Math.max(width, height) / (smallGridSize * MAX_LINES));
      console.log(`Grid density adjusted to 1/${smallGridDensity} for performance`);
    }
    
    // Create horizontal small grid lines
    for (let y = 0; y <= height; y += smallGridSize * smallGridDensity) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid',
        gridType: 'small'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical small grid lines
    for (let x = 0; x <= width; x += smallGridSize * smallGridDensity) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid',
        gridType: 'small'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create horizontal large grid lines
    for (let y = 0; y <= height; y += largeGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid',
        gridType: 'large'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text label for each large grid line (except at origin)
      if (y > 0) {
        const label = new Text(`${y / GRID_CONSTANTS.PIXELS_PER_METER}m`, {
          left: 5,
          top: y + 2,
          fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
          fill: GRID_CONSTANTS.MARKER_COLOR,
          selectable: false,
          objectType: 'grid',
          gridType: 'label'
        });
        
        gridObjects.push(label);
        canvas.add(label);
      }
    }
    
    // Create vertical large grid lines
    for (let x = 0; x <= width; x += largeGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectCaching: false,
        hoverCursor: "default",
        objectType: 'grid',
        gridType: 'large'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Add text label for each large grid line (except at origin)
      if (x > 0) {
        const label = new Text(`${x / GRID_CONSTANTS.PIXELS_PER_METER}m`, {
          left: x + 2,
          top: 5,
          fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
          fill: GRID_CONSTANTS.MARKER_COLOR,
          selectable: false,
          objectType: 'grid',
          gridType: 'label'
        });
        
        gridObjects.push(label);
        canvas.add(label);
      }
    }
    
    // Send all grid objects to back of the canvas
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    // Force render to ensure grid is visible
    canvas.requestRenderAll();
    
    // Log success
    console.log(`Created grid with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating simple grid:", error);
    toast.error("Error creating grid");
    return [];
  }
}

/**
 * Ensure grid is visible on canvas
 * @param {Canvas} canvas - The canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} Whether any changes were made
 */
export function ensureGridVisible(
  canvas: Canvas,
  gridObjects: FabricObject[]
): boolean {
  try {
    if (!canvas || !gridObjects.length) return false;
    
    let changesApplied = false;
    let objectsReapplied = 0;
    
    // Check each grid object
    for (const obj of gridObjects) {
      try {
        // If object is not on canvas, add it
        if (!canvas.contains(obj)) {
          canvas.add(obj);
          objectsReapplied++;
          changesApplied = true;
        }
        
        // Ensure grid objects are at the back
        canvas.sendToBack(obj);
      } catch (error) {
        console.error("Error fixing grid object:", error);
      }
    }
    
    // If we made changes, re-render
    if (changesApplied) {
      canvas.requestRenderAll();
      console.log(`Fixed grid visibility: reapplied ${objectsReapplied} objects`);
    }
    
    return changesApplied;
  } catch (error) {
    console.error("Error ensuring grid visibility:", error);
    return false;
  }
}

/**
 * Snap point to grid
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} gridSize - Grid size to snap to
 * @returns {{ x: number, y: number }} Snapped coordinates
 */
export function snapPointToGrid(
  x: number,
  y: number,
  gridSize: number = DEFAULT_SMALL_GRID_SIZE
): { x: number, y: number } {
  try {
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    return { x: snappedX, y: snappedY };
  } catch (error) {
    console.error("Error snapping to grid:", error);
    return { x, y }; // Return original coordinates on error
  }
}

/**
 * Force grid recreation
 * @param {Canvas} canvas - The canvas to create grid on
 * @param {FabricObject[]} existingGridObjects - Existing grid objects (if any)
 * @returns {FabricObject[]} Array of created grid objects
 */
export function forceGridRecreation(
  canvas: Canvas,
  existingGridObjects: FabricObject[] = []
): FabricObject[] {
  console.log("Forcing grid recreation");
  
  try {
    // Remove all existing grid objects first
    if (existingGridObjects.length > 0) {
      existingGridObjects.forEach(obj => {
        try {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        } catch (error) {
          // Ignore errors during removal
        }
      });
    }
    
    // Force canvas to update dimensions if needed
    if (canvas && canvas.lowerCanvasEl) {
      const containerWidth = canvas.wrapperEl?.clientWidth || 1000;
      const containerHeight = canvas.wrapperEl?.clientHeight || 800;
      
      if (containerWidth && containerHeight) {
        canvas.setWidth(containerWidth);
        canvas.setHeight(containerHeight);
        console.log(`Updated canvas dimensions: ${containerWidth}x${containerHeight}`);
      }
    }
    
    // Create new grid
    const gridObjects = createSimpleGrid(canvas, []);
    
    // Force render
    canvas.requestRenderAll();
    
    // Show success toast
    if (gridObjects.length > 0) {
      toast.success(`Grid recreated with ${gridObjects.length} objects`);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error in forceGridRecreation:", error);
    toast.error("Failed to recreate grid");
    return [];
  }
}
