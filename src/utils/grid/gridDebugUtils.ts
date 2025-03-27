/**
 * Grid debug utilities
 * Tools for debugging and fixing grid-related issues
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";

/**
 * Options for grid recovery
 */
interface GridRecoveryOptions {
  forceRecreation?: boolean;
  debugMode?: boolean;
  skipOnCanvas?: boolean;
}

/**
 * Dump grid state information to console
 * Helps debug grid-related issues
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const dumpGridState = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  console.group("Grid State Debug");
  console.log("Canvas dimensions:", canvas.width, "x", canvas.height);
  console.log("Grid layer objects count:", gridLayerRef.current.length);
  
  const gridObjectsOnCanvas = canvas.getObjects().filter(obj => 
    gridLayerRef.current.includes(obj)
  );
  
  console.log("Grid objects on canvas:", gridObjectsOnCanvas.length);
  console.log("All canvas objects count:", canvas.getObjects().length);
  console.groupEnd();
};

/**
 * Attempt to forcefully create grid
 * Used in emergency situations to guarantee grid creation
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {function} createGridFn - Custom grid creation function
 * @returns {FabricObject[] | null} Created grid objects or null if failed
 */
export const forceCreateGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn?: (canvas: Canvas) => FabricObject[]
): FabricObject[] | null => {
  try {
    if (!canvas) {
      console.error("Cannot force create grid: Canvas is null");
      return null;
    }
    
    console.log("Force creating grid...");
    
    // Clear existing grid objects first
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create new grid using the provided function or a simple fallback
    const grid = createGridFn ? createGridFn(canvas) : createFallbackGrid(canvas);
    
    if (grid && grid.length > 0) {
      gridLayerRef.current = grid;
      console.log(`Grid created with ${grid.length} objects`);
      canvas.requestRenderAll();
      return grid;
    }
    
    console.error("Grid creation returned no objects");
    return null;
  } catch (error) {
    console.error("Error force creating grid:", error);
    return null;
  }
};

/**
 * Create a simple fallback grid
 * Used when other grid creation methods fail
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @returns {FabricObject[]} Simple grid objects
 */
const createFallbackGrid = (canvas: Canvas): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  // Create a very simple grid with just a few lines
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create horizontal lines
  for (let y = 0; y < height; y += 100) {
    const line = new Line([0, y, width, y], {
      stroke: '#cccccc',
      strokeWidth: 0.5,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x < width; x += 100) {
    const line = new Line([x, 0, x, height], {
      stroke: '#cccccc',
      strokeWidth: 0.5,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    gridObjects.push(line);
  }
  
  return gridObjects;
};

/**
 * Attempt to recover grid if missing or corrupted
 * 
 * @param {Canvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @param {function} createGridFn - Custom grid creation function
 * @param {GridRecoveryOptions} options - Recovery options
 * @returns {boolean} Whether recovery was successful
 */
export const attemptGridRecovery = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGridFn: (canvas: Canvas) => FabricObject[],
  options: GridRecoveryOptions = {}
): boolean => {
  try {
    console.log("Attempting grid recovery...");
    
    const grid = forceCreateGrid(canvas, gridLayerRef, createGridFn);
    return grid !== null && grid.length > 0;
  } catch (error) {
    console.error("Error during grid recovery:", error);
    return false;
  }
};
