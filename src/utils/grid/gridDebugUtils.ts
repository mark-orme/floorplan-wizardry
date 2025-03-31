
/**
 * Grid debug utilities
 * @module utils/grid/gridDebugUtils
 */

import { Canvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Dump grid state to console
 * Useful for debugging grid issues
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {boolean} [verbose=false] - Whether to log verbose details
 */
export const dumpGridState = (canvas: Canvas, verbose: boolean = false): void => {
  if (!canvas) {
    logger.error("Cannot dump grid state: Canvas is null");
    return;
  }
  
  // Get all objects
  const objects = canvas.getObjects();
  
  // Filter grid objects
  const gridObjects = objects.filter(obj => obj.objectType === 'grid');
  
  // Basic grid info
  logger.info("Grid state:", {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    totalObjects: objects.length,
    gridObjects: gridObjects.length,
    nonGridObjects: objects.length - gridObjects.length,
    timestamp: new Date().toISOString()
  });
  
  // Verbose logging
  if (verbose) {
    logger.debug("Grid objects:", gridObjects);
    
    // Group grid objects by type
    const horizontalLines = gridObjects.filter(obj => 
      obj.type === 'line' && 
      ((obj as any).y1 === (obj as any).y2)
    );
    
    const verticalLines = gridObjects.filter(obj => 
      obj.type === 'line' && 
      ((obj as any).x1 === (obj as any).x2)
    );
    
    logger.debug("Grid composition:", {
      horizontalLines: horizontalLines.length,
      verticalLines: verticalLines.length,
      other: gridObjects.length - horizontalLines.length - verticalLines.length
    });
    
    // Canvas state
    logger.debug("Canvas state:", {
      viewportTransform: canvas.viewportTransform,
      zoom: canvas.getZoom(),
      isDrawingMode: canvas.isDrawingMode,
      selection: canvas.selection,
      renderOnAddRemove: canvas.renderOnAddRemove
    });
  }
};

/**
 * Force create grid for debugging
 * Creates a basic grid pattern regardless of existing grid
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {number} [spacing=20] - Grid spacing in pixels
 * @returns {FabricObject[]} Created grid objects
 */
export const forceCreateGrid = (
  canvas: Canvas, 
  spacing: number = 20
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot force create grid: Canvas is null");
    return [];
  }
  
  // Clear any existing grid objects
  const existingGridObjects = canvas.getObjects().filter(obj => obj.objectType === 'grid');
  existingGridObjects.forEach(obj => canvas.remove(obj));
  
  // Create new grid objects
  const gridObjects: FabricObject[] = [];
  
  // Calculate grid dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const line = new fabric.Line([0, y, width, y], {
      stroke: '#aaaaaa',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const line = new fabric.Line([x, 0, x, height], {
      stroke: '#aaaaaa',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Render the canvas
  canvas.renderAll();
  logger.info(`Force created grid with ${gridObjects.length} objects`);
  
  return gridObjects;
};
