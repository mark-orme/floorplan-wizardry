
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";
import { captureMessage } from "@/utils/sentry";

/**
 * Creates a basic grid on the canvas
 * @param canvas - Fabric canvas instance
 * @returns Array of created grid objects
 */
export const createBasicGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  try {
    // Create basic grid lines
    const gridSize = 20;
    const canvasWidth = canvas.width || 800;
    const canvasHeight = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [i, 0, i, canvasHeight],
        stroke: '#CCCCCC',
        strokeWidth: 1,
        selectable: false,
        evented: false
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [0, i, canvasWidth, i],
        stroke: '#CCCCCC',
        strokeWidth: 1,
        selectable: false,
        evented: false
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    logger.info(`Created ${gridObjects.length} grid objects`);
    
    captureMessage("Grid created", "grid-creation", {
      tags: { component: "Grid" },
      extra: { 
        objectCount: gridObjects.length,
        canvasDimensions: { width: canvasWidth, height: canvasHeight }
      }
    });
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Ensures grid visibility on canvas
 * @param canvas - Fabric canvas instance
 * @param gridObjects - Array of grid objects
 * @returns Boolean indicating success
 */
export const ensureGridVisibility = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas) {
    logger.error("Cannot ensure grid visibility: Canvas is null");
    return false;
  }
  
  if (!gridObjects || gridObjects.length === 0) {
    logger.error("Cannot ensure grid visibility: No grid objects provided");
    return false;
  }
  
  try {
    // Set visibility of all grid objects
    gridObjects.forEach(obj => {
      obj.set('visible', true);
    });
    
    // Move grid objects to back of canvas
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    canvas.renderAll();
    return true;
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
    return false;
  }
};

/**
 * Creates a reliable grid that ensures it's visible
 * @param canvas - Fabric canvas instance
 * @returns Array of created grid objects
 */
export const createReliableGrid = (canvas: FabricCanvas): FabricObject[] => {
  const gridObjects = createBasicGrid(canvas);
  ensureGridVisibility(canvas, gridObjects);
  return gridObjects;
};
