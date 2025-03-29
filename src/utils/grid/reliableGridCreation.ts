
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
    
    // Update timestamp to prevent rapid recreation
    lastGridCreationTime = Date.now();
    
    // Validate canvas
    if (!canvas || !canvas.width || !canvas.height) {
      console.error("Cannot create grid: Invalid canvas", {
        exists: !!canvas,
        width: canvas?.width,
        height: canvas?.height
      });
      return [];
    }
    
    // Get dimensions for grid
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear existing grid
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    
    // Create small grid with direct spacing values
    const smallGridSpacing = GRID_CONSTANTS.SMALL_GRID_SIZE;
    
    // Create horizontal small grid lines
    for (let y = 0; y <= height; y += smallGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Use canvas.sendToBack instead of line.sendToBack for Fabric.js v6 compatibility
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical small grid lines
    for (let x = 0; x <= width; x += smallGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Use canvas.sendToBack instead of line.sendToBack for Fabric.js v6 compatibility
      canvas.sendObjectToBack(line);
    }
    
    // Create large grid with direct spacing values
    const largeGridSpacing = GRID_CONSTANTS.LARGE_GRID_SIZE;
    
    // Create horizontal large grid lines
    for (let y = 0; y <= height; y += largeGridSpacing) {
      const line = new Line([0, y, width, y], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Use canvas.sendToBack instead of line.sendToBack for Fabric.js v6 compatibility
      canvas.sendObjectToBack(line);
    }
    
    // Create vertical large grid lines
    for (let x = 0; x <= width; x += largeGridSpacing) {
      const line = new Line([x, 0, x, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        selectable: false,
        evented: false,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        hoverCursor: 'default'
      });
      
      gridObjects.push(line);
      canvas.add(line);
      
      // Use canvas.sendToBack instead of line.sendToBack for Fabric.js v6 compatibility
      canvas.sendObjectToBack(line);
    }
    
    // Store in ref
    gridLayerRef.current = gridObjects;
    
    // Force render
    canvas.requestRenderAll();
    
    console.log(`Grid created with ${gridObjects.length} objects`);
    return gridObjects;
  } catch (error) {
    console.error("Error creating grid:", error);
    
    // Try emergency grid if main creation fails
    try {
      return createEmergencyGrid(canvas, gridLayerRef);
    } catch (emergencyError) {
      console.error("Emergency grid also failed:", emergencyError);
      return [];
    }
  }
};

/**
 * Create a simplified emergency grid when standard creation fails
 * Uses fewer, larger grid lines for reliability
 * 
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createEmergencyGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("Creating emergency grid...");
  
  // Get dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Clear existing grid
  if (gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  }
  
  const gridObjects: FabricObject[] = [];
  const gridSpacing = 50;
  
  // Create emergency grid background
  const bgRect = new Rect({
    left: 0,
    top: 0,
    width: width,
    height: height,
    fill: '#ffffff',
    strokeWidth: 0,
    selectable: false,
    evented: false
  });
  
  gridObjects.push(bgRect);
  canvas.add(bgRect);
  
  // Use canvas.sendToBack for Fabric.js v6 compatibility
  canvas.sendObjectToBack(bgRect);
  
  // Create emergency grid lines
  for (let y = 0; y <= height; y += gridSpacing) {
    const line = new Line([0, y, width, y], {
      stroke: '#e0e0e0',
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
    canvas.sendObjectToBack(line);
  }
  
  for (let x = 0; x <= width; x += gridSpacing) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
      selectable: false,
      evented: false,
      strokeWidth: 0.5,
      hoverCursor: 'default'
    });
    
    gridObjects.push(line);
    canvas.add(line);
    canvas.sendObjectToBack(line);
  }
  
  // Store in ref
  gridLayerRef.current = gridObjects;
  
  // Force render
  canvas.requestRenderAll();
  
  console.log(`Emergency grid created with ${gridObjects.length} objects`);
  return gridObjects;
};

/**
 * Test grid creation
 * Utility for debugging grid rendering
 * 
 * @param {FabricCanvas} canvas - Canvas to test on
 * @returns {boolean} Test result
 */
export const testGridCreation = (
  canvas: FabricCanvas
): boolean => {
  try {
    console.log("Testing grid creation...");
    
    if (!canvas || !canvas.width || !canvas.height) {
      console.error("Cannot test grid: Invalid canvas");
      return false;
    }
    
    // Test if we can add and remove objects
    const testLine = new Line([0, 0, 100, 100], {
      stroke: '#ff000022',
      selectable: false,
      evented: false,
      strokeWidth: 1
    });
    
    canvas.add(testLine);
    canvas.sendObjectToBack(testLine);
    
    // Force render
    canvas.requestRenderAll();
    
    // Remove test line
    canvas.remove(testLine);
    canvas.requestRenderAll();
    
    console.log("Grid test successful");
    return true;
  } catch (error) {
    console.error("Grid test failed:", error);
    return false;
  }
};

/**
 * Ensure grid objects are visible on canvas
 * 
 * @param {FabricCanvas} canvas - Canvas containing grid
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} Whether any fixes were applied
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  let fixesApplied = false;
  
  if (!canvas || gridLayerRef.current.length === 0) {
    return false;
  }
  
  try {
    // Count objects actually on canvas
    const objectsOnCanvas = gridLayerRef.current.filter(obj => 
      canvas.contains(obj)
    ).length;
    
    // If we're missing objects, try to add them back
    if (objectsOnCanvas < gridLayerRef.current.length) {
      console.log(`Grid visibility issue detected: ${objectsOnCanvas}/${gridLayerRef.current.length} objects on canvas`);
      
      gridLayerRef.current.forEach(obj => {
        if (!canvas.contains(obj)) {
          canvas.add(obj);
          canvas.sendObjectToBack(obj);
          fixesApplied = true;
        }
      });
      
      if (fixesApplied) {
        canvas.requestRenderAll();
        console.log("Grid visibility fixed");
      }
    }
    
    return fixesApplied;
  } catch (error) {
    console.error("Error ensuring grid visibility:", error);
    return false;
  }
};
