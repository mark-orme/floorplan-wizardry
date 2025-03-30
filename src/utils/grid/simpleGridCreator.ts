
/**
 * Simple Grid Creator
 * Reliable utilities for creating and managing grid elements
 * @module grid/simpleGridCreator
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { toast } from "sonner";
import logger from "@/utils/logger";

interface GridCreationOptions {
  smallGridSpacing?: number;
  largeGridSpacing?: number;
  smallGridColor?: string;
  largeGridColor?: string;
  smallGridWidth?: number;
  largeGridWidth?: number;
}

/**
 * Create grid elements for a canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {GridCreationOptions} options - Grid creation options
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridElements = (
  canvas: FabricCanvas,
  options: GridCreationOptions = {}
): FabricObject[] => {
  if (!canvas || !canvas.width || !canvas.height) {
    logger.error("Cannot create grid: Invalid canvas dimensions");
    return [];
  }

  // Use options or defaults from constants
  const smallGridSpacing = options.smallGridSpacing || GRID_CONSTANTS.SMALL_GRID_SIZE;
  const largeGridSpacing = options.largeGridSpacing || GRID_CONSTANTS.LARGE_GRID_SIZE;
  const smallGridColor = options.smallGridColor || GRID_CONSTANTS.SMALL_GRID_COLOR;
  const largeGridColor = options.largeGridColor || GRID_CONSTANTS.LARGE_GRID_COLOR;
  const smallGridWidth = options.smallGridWidth || GRID_CONSTANTS.SMALL_GRID_WIDTH;
  const largeGridWidth = options.largeGridWidth || GRID_CONSTANTS.LARGE_GRID_WIDTH;

  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width;
    const height = canvas.height;

    console.log(`Creating grid with dimensions: ${width}x${height}`);

    // Create vertical grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const isLargeLine = x % largeGridSpacing === 0;
      const line = new Line([x, 0, x, height], {
        stroke: isLargeLine ? largeGridColor : smallGridColor,
        strokeWidth: isLargeLine ? largeGridWidth : smallGridWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const isLargeLine = y % largeGridSpacing === 0;
      const line = new Line([0, y, width, y], {
        stroke: isLargeLine ? largeGridColor : smallGridColor,
        strokeWidth: isLargeLine ? largeGridWidth : smallGridWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        excludeFromExport: true,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }

    // Send all grid objects to back
    gridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });

    // Force render
    canvas.requestRenderAll();
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid elements:", error);
    return [];
  }
};

/**
 * Ensure grid is visible on canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if fixes were applied
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas || gridLayerRef.current.length === 0) return false;
  
  let fixed = false;
  
  // Check for missing grid objects and add them back
  gridLayerRef.current.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
      fixed = true;
    }
  });
  
  // Send all grid objects to back
  if (fixed) {
    gridLayerRef.current.forEach(obj => {
      canvas.sendToBack(obj);
    });
    canvas.renderAll();
    logger.info("Fixed grid visibility issues");
  }
  
  return fixed;
};

/**
 * Create reliable grid with proper handling
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }

  try {
    // Ensure canvas has proper dimensions
    const containerWidth = canvas.wrapperEl?.clientWidth || window.innerWidth;
    const containerHeight = canvas.wrapperEl?.clientHeight || window.innerHeight - 200;
    
    if (containerWidth && containerHeight) {
      if (canvas.width < 600 || canvas.height < 400) {
        console.log(`Adjusting canvas dimensions to ${containerWidth}x${containerHeight}`);
        canvas.setWidth(containerWidth);
        canvas.setHeight(containerHeight);
      }
    }

    // Clear existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    }

    // Create new grid
    const gridObjects = createGridElements(canvas);
    gridLayerRef.current = gridObjects;

    // Validate success
    if (gridObjects.length === 0) {
      logger.error("Grid creation failed to produce any objects");
      toast.error("Failed to create grid");
    } else {
      logger.info(`Grid created with ${gridObjects.length} objects`);
    }

    return gridObjects;
  } catch (error) {
    logger.error("Error in createReliableGrid:", error);
    toast.error("Error creating grid");
    return [];
  }
};
