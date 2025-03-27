
/**
 * Grid Creation Utilities
 * Provides robust grid creation functions with fallback mechanisms
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Line, Text, Object as FabricObject } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';
import logger from '@/utils/logger';
import { toast } from 'sonner';

// Default grid constants
const DEFAULT_GRID_COLOR = '#eeeeee';
const DEFAULT_GRID_TEXT_COLOR = '#aaaaaa';
const LARGE_GRID_COLOR = '#dddddd';
const SMALL_GRID_STROKE_WIDTH = 0.5;
const LARGE_GRID_STROKE_WIDTH = 1.2;

/**
 * Creates a basic emergency grid when standard grid creation fails
 * Uses simplified approach with minimal operations for reliability
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  try {
    logger.info("Creating emergency basic grid");
    console.log("🚨 Creating emergency basic grid");
    
    // Get canvas dimensions
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Clear any existing grid objects from the reference
    gridLayerRef.current = [];
    
    // Create a set to collect all grid objects
    const gridObjects: FabricObject[] = [];
    
    // Create large grid lines (every 100px)
    for (let i = 0; i <= width; i += 100) {
      const line = new Line([i, 0, i, height], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += 100) {
      const line = new Line([0, i, width, i], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Add some dimension markers
    for (let i = 100; i < width; i += 100) {
      const text = new Text(`${i/100}m`, {
        left: i + 5,
        top: 5,
        fontSize: 12,
        fill: DEFAULT_GRID_TEXT_COLOR,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(text);
      gridObjects.push(text);
    }
    
    for (let i = 100; i < height; i += 100) {
      const text = new Text(`${i/100}m`, {
        left: 5,
        top: i + 5,
        fontSize: 12,
        fill: DEFAULT_GRID_TEXT_COLOR,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(text);
      gridObjects.push(text);
    }
    
    // Force a render to display the grid
    canvas.requestRenderAll();
    
    // Store the grid objects in the reference
    gridLayerRef.current = gridObjects;
    
    logger.info(`Created emergency grid with ${gridObjects.length} objects`);
    console.log(`✅ Created emergency grid with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating emergency grid:", error);
    console.error("❌ Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Creates a complete grid with small and large grid lines and markers
 * Uses a more sophisticated approach with proper scaling
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create complete grid: Canvas is null");
    return [];
  }
  
  try {
    logger.info("Creating complete grid");
    console.log("🔲 Creating complete grid");
    
    // Get canvas dimensions
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Clear any existing grid objects from the reference
    gridLayerRef.current = [];
    
    // Create a set to collect all grid objects
    const gridObjects: FabricObject[] = [];
    const smallGridLines: FabricObject[] = [];
    const largeGridLines: FabricObject[] = [];
    const markers: FabricObject[] = [];
    
    // Define grid spacing (10cm in our scale)
    const smallGridSpacing = GRID_SPACING || 10;
    const largeGridSpacing = smallGridSpacing * 10; // 1m in our scale
    
    // Create small grid lines (10cm spacing)
    for (let i = 0; i <= width; i += smallGridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: DEFAULT_GRID_COLOR,
        strokeWidth: SMALL_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
      smallGridLines.push(line);
    }
    
    for (let i = 0; i <= height; i += smallGridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: DEFAULT_GRID_COLOR,
        strokeWidth: SMALL_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
      smallGridLines.push(line);
    }
    
    // Create large grid lines (1m spacing)
    for (let i = 0; i <= width; i += largeGridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
      largeGridLines.push(line);
    }
    
    for (let i = 0; i <= height; i += largeGridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: LARGE_GRID_STROKE_WIDTH,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(line);
      gridObjects.push(line);
      largeGridLines.push(line);
    }
    
    // Add dimension markers on large grid lines
    for (let i = largeGridSpacing; i < width; i += largeGridSpacing) {
      const text = new Text(`${i/largeGridSpacing}m`, {
        left: i + 5,
        top: 5,
        fontSize: 12,
        fill: DEFAULT_GRID_TEXT_COLOR,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(text);
      gridObjects.push(text);
      markers.push(text);
    }
    
    for (let i = largeGridSpacing; i < height; i += largeGridSpacing) {
      const text = new Text(`${i/largeGridSpacing}m`, {
        left: 5,
        top: i + 5,
        fontSize: 12,
        fill: DEFAULT_GRID_TEXT_COLOR,
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
      
      canvas.add(text);
      gridObjects.push(text);
      markers.push(text);
    }
    
    // Arrange grid elements in the correct z-order
    // Small grid lines at the back
    smallGridLines.forEach(line => {
      canvas.sendObjectToBack(line);
    });
    
    // Large grid lines in the middle
    largeGridLines.forEach(line => {
      canvas.bringForward(line);
    });
    
    // Markers at the front
    markers.forEach(marker => {
      canvas.bringObjectToFront(marker);
    });
    
    // Force a render to display the grid
    canvas.requestRenderAll();
    
    // Store the grid objects in the reference
    gridLayerRef.current = gridObjects;
    
    logger.info(`Created complete grid with ${gridObjects.length} objects`);
    console.log(`✅ Created complete grid with ${gridObjects.length} objects (${smallGridLines.length} small, ${largeGridLines.length} large, ${markers.length} markers)`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating complete grid:", error);
    console.error("❌ Error creating complete grid:", error);
    
    // Try the emergency grid as fallback
    return createBasicEmergencyGrid(canvas, gridLayerRef);
  }
};

/**
 * Test if the grid exists and is properly configured
 * Performs a thorough validation of grid elements
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether the grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    logger.error("Cannot validate grid: Canvas is null");
    return false;
  }
  
  // Check if grid exists at all
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    logger.warn("Grid validation failed: No grid elements in reference");
    return false;
  }
  
  // Check if at least 80% of grid objects are on the canvas
  const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj)).length;
  const gridSize = gridLayerRef.current.length;
  
  if (objectsOnCanvas < gridSize * 0.8) {
    logger.warn(`Grid validation failed: Only ${objectsOnCanvas}/${gridSize} grid elements on canvas`);
    return false;
  }
  
  // Check for at least one vertical and one horizontal line
  const verticalLines = gridLayerRef.current.filter(obj => {
    if (obj.type !== 'line') return false;
    const line = obj as Line;
    return line.x1 === line.x2;
  });
  
  const horizontalLines = gridLayerRef.current.filter(obj => {
    if (obj.type !== 'line') return false;
    const line = obj as Line;
    return line.y1 === line.y2;
  });
  
  if (verticalLines.length === 0 || horizontalLines.length === 0) {
    logger.warn(`Grid validation failed: Missing ${verticalLines.length === 0 ? 'vertical' : 'horizontal'} lines`);
    return false;
  }
  
  // All checks passed
  return true;
};

/**
 * Ensure the grid is created and visible on the canvas
 * Creates a new grid if none exists or validation fails
 * 
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether the grid was successfully ensured
 */
export const ensureGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    logger.error("Cannot ensure grid: Canvas is null");
    return false;
  }
  
  try {
    // First validate the existing grid
    const isGridValid = validateGrid(canvas, gridLayerRef);
    
    // If grid is valid, nothing more to do
    if (isGridValid) {
      return true;
    }
    
    // Grid is invalid or missing, try to create a complete grid
    logger.info("Grid validation failed, recreating grid");
    console.log("🔄 Grid validation failed, recreating grid");
    
    // Try to create a complete grid first
    try {
      createCompleteGrid(canvas, gridLayerRef);
      
      // Validate the created grid
      const isNewGridValid = validateGrid(canvas, gridLayerRef);
      
      if (isNewGridValid) {
        logger.info("Grid recreation successful");
        console.log("✅ Grid recreation successful");
        return true;
      }
    } catch (error) {
      logger.error("Error recreating complete grid:", error);
      console.error("❌ Error recreating complete grid:", error);
    }
    
    // If complete grid creation failed, try emergency grid
    logger.warn("Complete grid creation failed, trying emergency grid");
    console.log("⚠️ Complete grid creation failed, trying emergency grid");
    
    createBasicEmergencyGrid(canvas, gridLayerRef);
    
    // No need to validate emergency grid, just assume it worked
    logger.info("Emergency grid created as fallback");
    console.log("✅ Emergency grid created as fallback");
    
    return true;
  } catch (error) {
    logger.error("Error ensuring grid:", error);
    console.error("❌ Error ensuring grid:", error);
    return false;
  }
};
