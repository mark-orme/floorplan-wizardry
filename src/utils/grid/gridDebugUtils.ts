
/**
 * Grid debug utilities
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";

// Store global grid debug stats
export const gridDebugStats: Record<string, any> = {
  errorMessages: [],
  lastError: null,
  successfulCreations: 0,
  failedCreations: 0
};

/**
 * Create basic emergency grid when normal grid creation fails
 * @param {Canvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} [gridRef] - Optional reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas, 
  gridRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    logger.warn("Creating emergency grid");
    
    // Create simple grid lines
    const gridObjects: FabricObject[] = [];
    const gridSize = 50;
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Simple horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e5e5e5',
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Simple vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e5e5e5',
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    
    // Update reference if provided
    if (gridRef) {
      gridRef.current = gridObjects;
    }
    
    return gridObjects;
  } catch (error) {
    logger.error("Emergency grid creation failed:", error);
    return [];
  }
};

/**
 * Dump grid state for debugging
 * @param {Canvas} canvas - Fabric canvas
 * @returns {Object} Grid state information
 */
export const dumpGridState = (canvas: Canvas): Record<string, any> => {
  if (!canvas) {
    return { error: "Canvas is null" };
  }
  
  const allObjects = canvas.getObjects();
  const gridObjects = allObjects.filter(obj => (obj as any).objectType === 'grid');
  
  return {
    canvasDimensions: `${canvas.width}x${canvas.height}`,
    totalObjects: allObjects.length,
    gridObjects: gridObjects.length,
    nonGridObjects: allObjects.length - gridObjects.length,
    canvasState: canvas.toJSON(['objectType'])
  };
};

/**
 * Force create grid for debugging
 * @param {Canvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (canvas: Canvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot force-create grid: Canvas is null");
    return [];
  }
  
  // Remove existing grid objects
  const existingGridObjects = canvas.getObjects()
    .filter(obj => (obj as any).objectType === 'grid');
  
  existingGridObjects.forEach(obj => canvas.remove(obj));
  
  // Create new grid
  return createBasicEmergencyGrid(canvas);
};

/**
 * Diagnose grid failure
 * @param {Canvas | null} canvas - Canvas instance
 * @param {FabricObject[] | null} gridObjects - Grid objects
 * @param {string} context - Error context
 * @returns {Record<string, any>} Diagnostic information
 */
export const diagnoseGridFailure = (
  canvas: Canvas | null,
  gridObjects: FabricObject[] | null,
  context: string
): Record<string, any> => {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    context,
    canvasState: canvas ? {
      width: canvas.width,
      height: canvas.height,
      objectCount: canvas.getObjects().length,
      initialized: !!(canvas.width && canvas.height && canvas.width > 0 && canvas.height > 0)
    } : 'Canvas is null',
    gridObjects: gridObjects ? {
      count: gridObjects.length,
      onCanvas: canvas ? gridObjects.filter(obj => canvas.contains(obj)).length : 'unknown'
    } : 'No grid objects'
  };
  
  return diagnosis;
};
