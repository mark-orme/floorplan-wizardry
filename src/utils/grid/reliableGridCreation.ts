
/**
 * Reliable Grid Creation
 * Provides robust grid creation with fallbacks and diagnostics
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject, Rect } from "fabric";
import { GRID_CONSTANTS } from "@/constants/gridConstants";
import { toast } from "sonner";
import logger from "@/utils/logger";

// Track grid creation attempts to prevent excessive recreation
let lastGridCreationTime = 0;
const MIN_RECREATION_INTERVAL = 2000; // ms

/**
 * Check if grid creation is on cooldown
 * Prevents excessive grid recreation attempts
 * @returns {boolean} Whether creation should be throttled
 */
export const isGridCreationOnCooldown = (): boolean => {
  const now = Date.now();
  return (now - lastGridCreationTime) < MIN_RECREATION_INTERVAL;
};

/**
 * Reset grid creation state
 * Used when intentionally recreating grid
 */
export const resetGridCreationState = (): void => {
  lastGridCreationTime = 0;
};

/**
 * Create grid on canvas with reliability features
 * Includes fallbacks and automatic recovery
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.log("Creating reliable grid...");
    
    // Update creation timestamp
    lastGridCreationTime = Date.now();
    
    // Validate canvas
    if (!canvas || !canvas.width || !canvas.height) {
      console.error("Cannot create grid: Invalid canvas", {
        width: canvas?.width,
        height: canvas?.height
      });
      return [];
    }
    
    // Clear existing grid objects
    if (gridLayerRef.current && gridLayerRef.current.length > 0) {
      console.log(`Clearing ${gridLayerRef.current.length} existing grid objects`);
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Get canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Create grid objects
    const gridObjects: FabricObject[] = [];
    
    // Parameters for grid
    const smallGridSpacing = GRID_CONSTANTS.SMALL_GRID_SIZE;
    const largeGridSpacing = GRID_CONSTANTS.LARGE_GRID_SIZE;
    const smallGridColor = GRID_CONSTANTS.SMALL_GRID_COLOR;
    const largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR;
    
    // Create horizontal small grid lines
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      // Add to canvas and tracking
      canvas.add(line);
      
      // Move to back - use canvas method instead of object method
      canvas.sendObjectToBack(line);
      
      gridObjects.push(line);
    }
    
    // Create vertical small grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: smallGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      // Add to canvas and tracking
      canvas.add(line);
      
      // Move to back - use canvas method instead of object method
      canvas.sendObjectToBack(line);
      
      gridObjects.push(line);
    }
    
    // Create horizontal large grid lines
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default'
      });
      
      // Add to canvas and tracking
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: largeGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1,
        hoverCursor: 'default'
      });
      
      // Add to canvas and tracking
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Store the created grid objects in the ref
    gridLayerRef.current = gridObjects;
    
    // Force canvas to render
    canvas.requestRenderAll();
    
    console.log(`Grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating reliable grid:", error);
    logger.error("Error creating reliable grid:", error);
    
    // Try fallback grid
    try {
      return createFallbackGrid(canvas, gridLayerRef);
    } catch (fallbackError) {
      console.error("Fallback grid also failed:", fallbackError);
      logger.error("Fallback grid also failed:", fallbackError);
      
      // Try minimal emergency grid as last resort
      try {
        return createEmergencyGrid(canvas, gridLayerRef);
      } catch (emergencyError) {
        console.error("Emergency grid also failed:", emergencyError);
        logger.error("Emergency grid also failed:", emergencyError);
        return [];
      }
    }
  }
};

/**
 * Create a simplified fallback grid
 * Used when the full grid creation fails
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
const createFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating fallback grid...");
  
  // Clear existing grid objects
  if (gridLayerRef.current && gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  }
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create simplified grid
  const gridObjects: FabricObject[] = [];
  
  // Red emergency grid lines (large spacing only)
  for (let y = 0; y <= height; y += 100) {
    const line = new Line([0, y, width, y], {
      stroke: "#ff000022",
      selectable: false,
      evented: false,
      strokeWidth: 1
    });
    
    canvas.add(line);
    
    // Move to back - use canvas method instead of object method
    canvas.sendObjectToBack(line);
    
    gridObjects.push(line);
  }
  
  for (let x = 0; x <= width; x += 100) {
    const line = new Line([x, 0, x, height], {
      stroke: "#ff000022",
      selectable: false,
      evented: false,
      strokeWidth: 1
    });
    
    canvas.add(line);
    
    // Move to back - use canvas method instead of object method
    canvas.sendObjectToBack(line);
    
    gridObjects.push(line);
  }
  
  // Store the created grid objects
  gridLayerRef.current = gridObjects;
  
  // Force canvas to render
  canvas.requestRenderAll();
  
  // Show fallback message
  toast.warning("Using simplified grid due to rendering issues", {
    id: "fallback-grid",
    duration: 3000
  });
  
  console.log(`Fallback grid created with ${gridObjects.length} objects`);
  return gridObjects;
};

/**
 * Create minimal emergency grid
 * Last resort when all other grid creation methods fail
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
const createEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating emergency grid...");
  
  // Clear existing grid objects
  if (gridLayerRef.current && gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  }
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create a single background rect as grid indicator
  const background = new Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: '#f9f9f9',
    strokeWidth: 0,
    selectable: false,
    evented: false
  });
  
  canvas.add(background);
  
  // Move to back - use canvas method instead of object method
  canvas.sendObjectToBack(background);
  
  // Store in grid objects
  gridLayerRef.current = [background];
  
  // Force canvas to render
  canvas.requestRenderAll();
  
  // Show emergency message
  toast.error("Using emergency grid mode - functionality may be limited", {
    id: "emergency-grid",
    duration: 5000
  });
  
  console.log("Emergency grid created");
  return gridLayerRef.current;
};

/**
 * Ensure grid objects are visible on canvas
 * Checks and fixes missing grid objects
 * 
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether grid was fixed
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  // Skip if no grid objects
  if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
    return false;
  }
  
  // Check if any grid objects are missing from canvas
  const missingObjects = gridLayerRef.current.filter(obj => !canvas.contains(obj));
  
  // If more than 50% of grid objects are missing, recreate grid
  if (missingObjects.length > gridLayerRef.current.length * 0.5) {
    console.log(`Grid objects missing: ${missingObjects.length}/${gridLayerRef.current.length}, recreating grid`);
    createReliableGrid(canvas, gridLayerRef);
    return true;
  }
  
  // If some objects are missing, add them back
  if (missingObjects.length > 0) {
    console.log(`Adding ${missingObjects.length} missing grid objects back to canvas`);
    
    missingObjects.forEach(obj => {
      // Skip if already on canvas
      if (!canvas.contains(obj)) {
        canvas.add(obj);
        
        // Send to back to prevent covering other objects
        canvas.sendObjectToBack(obj);
      }
    });
    
    // Force canvas to render
    canvas.requestRenderAll();
    return true;
  }
  
  return false;
};

/**
 * Test grid creation for debugging
 * Logs detailed diagnostic information
 * 
 * @param {FabricCanvas} canvas - Canvas to test
 */
export const testGridCreation = (canvas: FabricCanvas): void => {
  console.group("Grid Creation Test");
  console.log("Canvas:", canvas);
  console.log("Width:", canvas.width);
  console.log("Height:", canvas.height);
  console.log("Objects:", canvas.getObjects().length);
  console.groupEnd();
};
