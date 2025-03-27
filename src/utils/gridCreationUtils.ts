
/**
 * Grid creation utilities
 * Provides functions for creating and managing canvas grids
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { 
  GRID_SPACING, 
  SMALL_GRID, 
  LARGE_GRID,
  CANVAS_DEFAULT_WIDTH,
  CANVAS_DEFAULT_HEIGHT,
  SMALL_GRID_LINE_WIDTH,
  LARGE_GRID_LINE_WIDTH
} from "@/constants/numerics";
import logger from "@/utils/logger";

/**
 * Create a complete grid system with small and large grid lines
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  const width = canvas.width || CANVAS_DEFAULT_WIDTH;
  const height = canvas.height || CANVAS_DEFAULT_HEIGHT;
  
  // Log grid creation
  logger.info(`Creating complete grid system with dimensions: ${width}x${height}`);
  
  // Create small grid lines (0.1m spacing)
  logger.info(`Creating small scale grid with spacing: ${SMALL_GRID}`);
  const smallGridObjects = createGridLines(canvas, width, height, SMALL_GRID, SMALL_GRID_LINE_WIDTH, 'rgba(200, 200, 200, 0.2)');
  
  // Create large grid lines (1m spacing)
  logger.info(`Creating large scale grid with spacing: ${LARGE_GRID}`);
  const largeGridObjects = createGridLines(canvas, width, height, LARGE_GRID, LARGE_GRID_LINE_WIDTH, 'rgba(150, 150, 150, 0.4)');
  
  // Store grid objects in the reference
  const allGridObjects = [...smallGridObjects, ...largeGridObjects];
  gridLayerRef.current = allGridObjects;
  
  // Log grid creation results
  logger.info(`Grid created with ${allGridObjects.length} objects (${smallGridObjects.length} small, ${largeGridObjects.length} large)`);
  
  return allGridObjects;
};

/**
 * Create a basic emergency grid when normal grid creation fails
 * Uses minimal settings for better reliability
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  logger.warn("Creating emergency grid with minimal settings");
  
  const width = canvas.width || CANVAS_DEFAULT_WIDTH;
  const height = canvas.height || CANVAS_DEFAULT_HEIGHT;
  
  // Only create large grid lines for emergency grid
  const gridObjects = createGridLines(canvas, width, height, LARGE_GRID, LARGE_GRID_LINE_WIDTH, 'rgba(255, 0, 0, 0.2)');
  
  // Add all grid objects to canvas
  gridObjects.forEach(obj => {
    canvas.add(obj);
  });
  
  // Update grid layer reference
  gridLayerRef.current = gridObjects;
  
  // Force render
  canvas.requestRenderAll();
  
  logger.info(`Emergency grid created with ${gridObjects.length} objects`);
  
  return gridObjects;
};

/**
 * Create grid lines for a specific spacing
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @param {number} spacing - Grid spacing in pixels
 * @param {number} strokeWidth - Line thickness
 * @param {string} strokeColor - Line color
 * @returns {FabricObject[]} Array of created grid line objects
 */
function createGridLines(
  canvas: FabricCanvas,
  width: number,
  height: number,
  spacing: number,
  strokeWidth: number,
  strokeColor: string
): FabricObject[] {
  const gridLines: FabricObject[] = [];
  
  // Create vertical lines
  for (let i = 0; i <= width; i += spacing) {
    const line = new Line([i, 0, i, height], {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectType: 'gridLine',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += spacing) {
    const line = new Line([0, i, width, i], {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      objectType: 'gridLine',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  logger.info(`Created grid with ${gridLines.length} lines (spacing: ${spacing}px)`);
  
  return gridLines;
}

/**
 * Validate grid health and existence
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to stored grid objects
 * @returns {boolean} Whether grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if grid objects exist
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    logger.warn("Grid validation failed: No grid objects found");
    return false;
  }
  
  // Check if grid objects are on canvas
  const allObjectsOnCanvas = gridLayerRef.current.every(obj => canvas.contains(obj));
  
  if (!allObjectsOnCanvas) {
    logger.warn("Grid validation failed: Some grid objects are missing from canvas");
    return false;
  }
  
  return true;
};

/**
 * Ensure grid exists, creating it if needed
 * 
 * @param {FabricCanvas} canvas - Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to stored grid objects
 * @returns {boolean} Whether grid exists or was created successfully
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Check if grid already exists and is valid
  if (validateGrid(canvas, gridLayerRef)) {
    return true;
  }
  
  // Try to create grid
  try {
    const gridObjects = createCompleteGrid(canvas, gridLayerRef);
    return gridObjects.length > 0;
  } catch (error) {
    logger.error("Error ensuring grid:", error);
    
    // Try emergency grid as fallback
    try {
      const emergencyGrid = createBasicEmergencyGrid(canvas, gridLayerRef);
      return emergencyGrid.length > 0;
    } catch (emergencyError) {
      logger.error("Emergency grid creation also failed:", emergencyError);
      return false;
    }
  }
};
