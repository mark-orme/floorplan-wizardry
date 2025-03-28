
/**
 * Grid debug utilities
 * Helper functions for debugging grid issues
 * @module grid/gridDebugUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import logger from "../logger";

/**
 * Dumps the current state of the grid for debugging
 * Logs canvas dimensions and grid object information to the console
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {FabricObject[]} gridObjects - Array of grid objects
 * @returns {void}
 */
export function dumpGridState(
  canvas: Canvas,
  gridObjects: FabricObject[]
): void {
  if (!canvas) {
    console.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  console.group("Grid Debug Information");
  
  // Log canvas info
  console.log("Canvas dimensions:", {
    width: canvas.width,
    height: canvas.height,
    zoom: canvas.getZoom?.() || 1
  });
  
  // Log grid objects
  console.log("Grid objects:", {
    total: gridObjects.length,
    onCanvas: gridObjects.filter(obj => canvas.contains(obj)).length,
    missing: gridObjects.filter(obj => !canvas.contains(obj)).length
  });
  
  // Log canvas objects
  const allObjects = canvas.getObjects();
  console.log("All canvas objects:", {
    total: allObjects.length,
    gridObjects: allObjects.filter(obj => obj.objectType === 'grid').length
  });
  
  console.groupEnd();
}

/**
 * Create a basic emergency grid
 * Used as a last resort when all other grid creation methods fail
 * Creates a simple grid with minimal styling
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export function createBasicEmergencyGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  try {
    if (process.env.NODE_ENV === 'development') {
      logger.info("Creating basic emergency grid");
    }
    
    // Clear any existing grid
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
    
    // Create a very simple grid with large spacing only
    const spacing = 100;
    
    // Create horizontal grid lines
    for (let y = 0; y <= height; y += spacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default',
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Create vertical grid lines
    for (let x = 0; x <= width; x += spacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default',
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Force a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
}

/**
 * Force creation of a grid for debugging purposes
 * Creates a grid regardless of existing grid or state
 * 
 * @param {Canvas} canvas - The Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export function forceCreateGrid(
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] {
  try {
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    return gridObjects;
  } catch (error) {
    logger.error("Force grid creation failed:", error);
    return [];
  }
}
