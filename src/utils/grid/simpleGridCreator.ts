
/**
 * Simple Grid Creator
 * Provides simplified grid creation functions with good defaults
 * @module utils/grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import logger from "@/utils/logger";

/**
 * Create a reliable grid on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create grid: Canvas has invalid dimensions");
      return [];
    }

    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Clear existing grid objects if any
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const isLarge = i % GRID_CONSTANTS.LARGE_GRID_SIZE === 0;
      const line = new Line([i, 0, i, height], {
        stroke: isLarge ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: isLarge ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        objectCaching: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Add text markers for large grid lines
      if (isLarge && i > 0) {
        const text = new Text(`${i / GRID_CONSTANTS.PIXELS_PER_METER}m`, {
          left: i + 5,
          top: 5,
          fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
          fill: GRID_CONSTANTS.MARKER_COLOR,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        
        canvas.add(text);
        gridObjects.push(text);
      }
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const isLarge = i % GRID_CONSTANTS.LARGE_GRID_SIZE === 0;
      const line = new Line([0, i, width, i], {
        stroke: isLarge ? GRID_CONSTANTS.LARGE_GRID_COLOR : GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: isLarge ? GRID_CONSTANTS.LARGE_GRID_WIDTH : GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: "default",
        objectCaching: false
      });
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Add text markers for large grid lines
      if (isLarge && i > 0) {
        const text = new Text(`${i / GRID_CONSTANTS.PIXELS_PER_METER}m`, {
          left: 5,
          top: i + 5,
          fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
          fill: GRID_CONSTANTS.MARKER_COLOR,
          selectable: false,
          evented: false,
          objectCaching: false
        });
        
        canvas.add(text);
        gridObjects.push(text);
      }
    }
    
    // Send grid objects to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    // Update reference
    gridLayerRef.current = gridObjects;
    
    // Request render to ensure visibility
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating reliable grid:", error);
    return [];
  }
};

/**
 * Ensure grid objects are visible on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether visibility was fixed
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || gridLayerRef.current.length === 0) {
    return false;
  }
  
  let fixedAny = false;
  
  // Check each grid object
  for (const obj of gridLayerRef.current) {
    // If object not on canvas, add it
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      canvas.sendToBack(obj);
      fixedAny = true;
    }
    // If object is hidden, show it
    else if (!obj.visible) {
      obj.visible = true;
      fixedAny = true;
    }
  }
  
  if (fixedAny) {
    canvas.requestRenderAll();
    return true;
  }
  
  return false;
};
