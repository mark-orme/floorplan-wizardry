/**
 * Grid creation utilities
 * @module utils/gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import logger from "../logger";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

/**
 * Create a complete grid
 * @param {Canvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} [gridRef] - Optional reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (
  canvas: Canvas,
  gridRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create grid: Invalid canvas or dimensions");
      return [];
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    const gridSize = 20;
    
    // Create grid lines
    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const isMajor = i % 100 === 0;
      const line = new Line([0, i, width, i], {
        stroke: isMajor ? '#d0d0d0' : '#e5e5e5',
        strokeWidth: isMajor ? 1 : 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const isMajor = i % 100 === 0;
      const line = new Line([i, 0, i, height], {
        stroke: isMajor ? '#d0d0d0' : '#e5e5e5',
        strokeWidth: isMajor ? 1 : 0.5,
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
    
    logger.info(`Grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create enhanced grid with major/minor lines
 * @param {Canvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createEnhancedGrid = (
  canvas: Canvas
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create enhanced grid: Invalid canvas or dimensions");
      return [];
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Minor grid (20px)
    const minorGridSize = 20;
    const minorColor = '#f0f0f0';
    
    // Major grid (100px)
    const majorGridSize = 100;
    const majorColor = '#d0d0d0';
    
    // Create minor grid lines
    // Horizontal minor lines
    for (let i = 0; i <= height; i += minorGridSize) {
      // Skip if this will also be a major line
      if (i % majorGridSize === 0) continue;
      
      const line = new Line([0, i, width, i], {
        stroke: minorColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Vertical minor lines
    for (let i = 0; i <= width; i += minorGridSize) {
      // Skip if this will also be a major line
      if (i % majorGridSize === 0) continue;
      
      const line = new Line([i, 0, i, height], {
        stroke: minorColor,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create major grid lines
    // Horizontal major lines
    for (let i = 0; i <= height; i += majorGridSize) {
      const line = new Line([0, i, width, i], {
        stroke: majorColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Vertical major lines
    for (let i = 0; i <= width; i += majorGridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: majorColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    logger.info(`Enhanced grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating enhanced grid:", error);
    return [];
  }
};

/**
 * Create basic grid
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} [existingGrid] - Optional array of existing grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicGrid = (
  canvas: Canvas,
  existingGrid?: FabricObject[]
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create basic grid: Invalid canvas or dimensions");
      return [];
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    const gridSize = 50;
    
    // Create grid lines
    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e8e8e8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e8e8e8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating basic grid:", error);
    return [];
  }
};

/**
 * Create basic emergency grid
 * @param {Canvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas
): FabricObject[] => {
  try {
    if (!canvas || !canvas.width || !canvas.height) {
      logger.error("Cannot create emergency grid: Invalid canvas or dimensions");
      return [];
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const gridObjects: FabricObject[] = [];
    
    // Create minimal grid with larger spacing (for performance)
    const emergencySpacing = 50;
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += emergencySpacing) {
      const line = new Line([0, y, width, y], {
        stroke: '#e8e8e8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += emergencySpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: '#e8e8e8',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Verify if grid exists on canvas
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {boolean} True if grid exists
 */
export const verifyGridExists = (
  canvas: Canvas, 
  gridObjects: FabricObject[] | React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  // Handle both array and ref object
  const gridArray = 'current' in gridObjects ? gridObjects.current : gridObjects;
  
  if (!gridArray || gridArray.length === 0) {
    return false;
  }
  
  // Check if grid objects exist on canvas
  const gridOnCanvas = gridArray.filter(obj => canvas.contains(obj));
  return gridOnCanvas.length > 0;
};

/**
 * Retry with backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retries
 * @param {number} delayFactor - Delay factor for exponential backoff
 * @returns {Promise<any>} Result of function
 */
export const retryWithBackoff = async (
  fn: () => Promise<any>, 
  maxRetries: number = 3,
  delayFactor: number = 500
): Promise<any> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, i) * delayFactor; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Reorder grid objects
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 * @returns {void}
 */
export const reorderGridObjects = (
  canvas: Canvas, 
  gridObjects: FabricObject[] | React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas) return;
  
  // Handle both array and ref object
  const gridArray = 'current' in gridObjects ? gridObjects.current : gridObjects;
  
  // Send grid objects to back
  gridArray.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  canvas.renderAll();
};

/**
 * Ensure grid exists
 * @param {Canvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridRef - Grid objects to check
 * @param {Function} createGridFn - Function to create grid
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: Canvas, 
  gridRef: React.MutableRefObject<FabricObject[]>,
  createGridFn = createCompleteGrid
): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid exists
  if (!verifyGridExists(canvas, gridRef)) {
    return createGridFn(canvas, gridRef);
  }
  
  return gridRef.current;
};

/**
 * Validate grid
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} True if grid valid
 */
export const validateGrid = (
  canvas: Canvas, 
  gridObjects: FabricObject[] | React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  // Handle both array and ref object
  const gridArray = 'current' in gridObjects ? gridObjects.current : gridObjects;
  
  if (!gridArray || gridArray.length === 0) {
    return false;
  }
  
  // Check if grid objects exist on canvas
  const gridOnCanvas = gridArray.filter(obj => canvas.contains(obj));
  return gridOnCanvas.length === gridArray.length;
};

/**
 * Create grid layer
 * @param {Canvas} canvas - Fabric canvas
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (canvas: Canvas): FabricObject[] => {
  return createCompleteGrid(canvas);
};

/**
 * Create fallback grid
 * @param {Canvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableFallbackGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  logger.info("Creating fallback grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create intermediate grid with standard spacing
    const smallGridSpacing = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const largeGridSpacing = GRID_CONSTANTS.LARGE_GRID_SIZE;
    
    // Create large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      gridObjects.push(line);
      canvas.add(line);
    }
    
    // Update the grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Request a render
    canvas.requestRenderAll();
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating fallback grid:", error);
    return [];
  }
};

/**
 * Create a specific grid layer for advanced rendering
 * Renamed to avoid duplicate declaration
 * 
 * @param {Canvas} canvas - The fabric canvas
 * @param {string} layerType - Type of grid layer to create
 * @returns {FabricObject[]} Created grid objects
 */
export const createSpecificGridLayer = (
  canvas: Canvas,
  layerType: 'small' | 'large' | 'markers'
): FabricObject[] => {
  if (!canvas) return [];
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridObjects: FabricObject[] = [];
  
  try {
    switch (layerType) {
      case 'small':
        // Create small grid lines
        for (let x = 0; x <= width; x += GRID_CONSTANTS.SMALL_GRID_SIZE) {
          const line = new Line([x, 0, x, height], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        
        for (let y = 0; y <= height; y += GRID_CONSTANTS.SMALL_GRID_SIZE) {
          const line = new Line([0, y, width, y], {
            stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        break;
        
      case 'large':
        // Create large grid lines
        for (let x = 0; x <= width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          const line = new Line([x, 0, x, height], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        
        for (let y = 0; y <= height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          const line = new Line([0, y, width, y], {
            stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
            strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(line);
          canvas.add(line);
        }
        break;
        
      case 'markers':
        // Create grid markers (labels)
        for (let x = GRID_CONSTANTS.LARGE_GRID_SIZE; x < width; x += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          // Convert numbers to strings for display
          const xLabel = String(Math.round(x / GRID_CONSTANTS.PIXELS_PER_METER));
          const text = new Text(xLabel, {
            left: x + 2,
            top: 2,
            fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
            fill: GRID_CONSTANTS.MARKER_COLOR,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(text);
          canvas.add(text);
        }
        
        for (let y = GRID_CONSTANTS.LARGE_GRID_SIZE; y < height; y += GRID_CONSTANTS.LARGE_GRID_SIZE) {
          // Convert numbers to strings for display
          const yLabel = String(Math.round(y / GRID_CONSTANTS.PIXELS_PER_METER));
          const text = new Text(yLabel, {
            left: 2,
            top: y + 2,
            fontSize: GRID_CONSTANTS.MARKER_TEXT_SIZE,
            fill: GRID_CONSTANTS.MARKER_COLOR,
            selectable: false,
            evented: false,
            objectType: 'grid'
          });
          
          gridObjects.push(text);
          canvas.add(text);
        }
        break;
    }
    
    return gridObjects;
  } catch (error) {
    logger.error(`Error creating grid layer ${layerType}:`, error);
    return [];
  }
};

/**
 * Check if complete grid exists
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to check
 * @returns {boolean} True if complete grid exists
 */
export const hasCompleteGrid = (
  canvas: Canvas, 
  gridObjects: FabricObject[] | React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  // Handle both array and ref object
  const gridArray = 'current' in gridObjects ? gridObjects.current : gridObjects;
  
  if (!gridArray || gridArray.length === 0) {
    return false;
  }
  
  // Check if we have a complete grid (at least 20 lines)
  return gridArray.length >= 20 && verifyGridExists(canvas, gridArray);
};

/**
 * Force grid render
 * @param {Canvas} canvas - Fabric canvas
 * @param {FabricObject[]} gridObjects - Grid objects to render
 * @returns {void}
 */
export const forceGridRender = (
  canvas: Canvas, 
  gridObjects: FabricObject[] | React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas) return;
  
  // Handle both array and ref object
  const gridArray = 'current' in gridObjects ? gridObjects.current : gridObjects;
  
  // Re-add grid objects if not already on canvas
  gridArray.forEach(obj => {
    if (!canvas.contains(obj)) {
      canvas.add(obj);
    }
  });
  
  // Render all
  canvas.renderAll();
};
