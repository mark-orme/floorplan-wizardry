
/**
 * Reliable grid creation module
 * Provides robust grid creation with enhanced error handling and retry mechanisms
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from "fabric";
import { toast } from "sonner";
import logger from "../logger";
import { GRID_CONSTANTS } from "@/constants/gridConstants";

// Grid creation attempt tracking
let gridCreationAttempts = 0;
const MAX_GRID_CREATION_ATTEMPTS = 5;
let lastGridCreationTime = 0;
const GRID_CREATION_COOLDOWN = 1000; // ms

/**
 * Reset grid creation state
 */
export const resetGridCreationState = (): void => {
  gridCreationAttempts = 0;
  lastGridCreationTime = 0;
  console.log("🔄 Grid creation state reset");
};

/**
 * Check if grid needs to be recreated based on time since last creation
 * @param {number} cooldownMs - Cooldown time in milliseconds
 * @returns {boolean} Whether grid creation is on cooldown
 */
export const isGridCreationOnCooldown = (cooldownMs: number = GRID_CREATION_COOLDOWN): boolean => {
  const now = Date.now();
  return now - lastGridCreationTime < cooldownMs;
};

/**
 * Create a basic grid with small and large lines and labels
 * @param {FabricCanvas} canvas - The canvas to draw the grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("📐 Creating reliable grid on canvas", {
    width: canvas.width, 
    height: canvas.height,
    attempts: gridCreationAttempts
  });
  
  // Track attempt
  gridCreationAttempts++;
  lastGridCreationTime = Date.now();
  
  // First validate the canvas
  if (!canvas || !canvas.width || !canvas.height) {
    console.error("❌ Cannot create grid on invalid canvas", { canvas });
    throw new Error("Invalid canvas for grid creation");
  }
  
  try {
    // Clear existing grid objects
    if (gridLayerRef.current && gridLayerRef.current.length > 0) {
      console.log(`🧹 Clearing ${gridLayerRef.current.length} existing grid objects`);
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const { SMALL_GRID, LARGE_GRID, SMALL_GRID_COLOR, LARGE_GRID_COLOR, MARKER_COLOR } = GRID_CONSTANTS;
    
    // Create arrays to store different grid elements
    const smallGridLines: FabricObject[] = [];
    const largeGridLines: FabricObject[] = [];
    const markers: FabricObject[] = [];
    
    // Create small grid lines (lighter, more frequent)
    for (let x = 0; x <= width; x += SMALL_GRID) {
      const line = new Line([x, 0, x, height], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      smallGridLines.push(line);
      canvas.add(line);
    }
    
    for (let y = 0; y <= height; y += SMALL_GRID) {
      const line = new Line([0, y, width, y], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      smallGridLines.push(line);
      canvas.add(line);
    }
    
    // Create large grid lines (darker, less frequent)
    for (let x = 0; x <= width; x += LARGE_GRID) {
      const line = new Line([x, 0, x, height], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      largeGridLines.push(line);
      canvas.add(line);
      
      // Add text marker
      if (x > 0) {
        const marker = new Text(x.toString(), {
          left: x + 5,
          top: 5,
          fontSize: 10,
          fill: MARKER_COLOR,
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        markers.push(marker);
        canvas.add(marker);
      }
    }
    
    for (let y = 0; y <= height; y += LARGE_GRID) {
      const line = new Line([0, y, width, y], {
        stroke: LARGE_GRID_COLOR,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      largeGridLines.push(line);
      canvas.add(line);
      
      // Add text marker
      if (y > 0) {
        const marker = new Text(y.toString(), {
          left: 5,
          top: y + 5,
          fontSize: 10,
          fill: MARKER_COLOR,
          selectable: false,
          evented: false,
          objectType: 'grid'
        });
        markers.push(marker);
        canvas.add(marker);
      }
    }
    
    // Combine all grid objects
    const allGridObjects = [...smallGridLines, ...largeGridLines, ...markers];
    
    // Store in the provided ref for future access
    gridLayerRef.current = allGridObjects;
    
    // Send the grid to back
    allGridObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Force canvas to render
    canvas.requestRenderAll();
    
    console.log(`✅ Grid created successfully with ${allGridObjects.length} objects`);
    
    return allGridObjects;
  }
  catch (error) {
    console.error("❌ Error creating grid:", error);
    logger.error("Grid creation error:", error);
    
    // Attempt fallback grid creation
    if (gridCreationAttempts <= MAX_GRID_CREATION_ATTEMPTS) {
      console.log(`🔄 Attempting fallback grid creation (attempt ${gridCreationAttempts})`);
      return createFallbackGrid(canvas, gridLayerRef);
    } else {
      console.error("❌ Maximum grid creation attempts reached");
      toast.error("Could not create drawing grid. Please refresh the page.");
      return [];
    }
  }
};

/**
 * Create a minimal fallback grid when normal creation fails
 * @param {FabricCanvas} canvas - The canvas to draw the grid on
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const createFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  console.log("🚨 Creating fallback grid");
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const fallbackObjects: FabricObject[] = [];
    
    // Use a larger grid size for the fallback to minimize objects
    const gridSize = 50;
    
    // Create minimal horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: 'rgba(200, 200, 200, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      fallbackObjects.push(line);
      canvas.add(line);
    }
    
    // Create minimal vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: 'rgba(200, 200, 200, 0.5)',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      fallbackObjects.push(line);
      canvas.add(line);
    }
    
    // Store in the provided ref
    gridLayerRef.current = fallbackObjects;
    
    // Send the grid to back
    fallbackObjects.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Force canvas to render
    canvas.requestRenderAll();
    
    console.log(`✅ Fallback grid created with ${fallbackObjects.length} objects`);
    toast.success("Basic drawing grid created");
    
    return fallbackObjects;
  }
  catch (error) {
    console.error("❌ Critical error in fallback grid creation:", error);
    logger.error("Fallback grid creation error:", error);
    return [];
  }
};

/**
 * Verify grid is visible and reorder if needed
 * @param {FabricCanvas} canvas - The canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas || !gridLayerRef.current.length) {
    return;
  }
  
  try {
    // Check if grid objects are on canvas
    const missingObjects = gridLayerRef.current.filter(obj => !canvas.contains(obj));
    
    if (missingObjects.length > 0) {
      console.log(`🔄 Re-adding ${missingObjects.length} missing grid objects`);
      
      missingObjects.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    // Send all grid objects to back
    gridLayerRef.current.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Force render
    canvas.requestRenderAll();
  }
  catch (error) {
    console.error("Error ensuring grid visibility:", error);
  }
};

/**
 * Test grid creation and add diagnostic info to canvas
 * Useful for debugging grid creation issues
 * @param {FabricCanvas} canvas - The canvas to test
 */
export const testGridCreation = (canvas: FabricCanvas): void => {
  console.log("🔍 Running grid creation test");
  
  if (!canvas) {
    console.error("Cannot test grid creation: Canvas is null");
    return;
  }
  
  try {
    // Add diagnostic info to canvas
    const diagnosticText = new Text(`Canvas: ${canvas.width}x${canvas.height}\nTime: ${new Date().toISOString()}`, {
      left: 10,
      top: 10,
      fontSize: 12,
      fill: 'rgba(255, 0, 0, 0.7)',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      selectable: false
    });
    
    canvas.add(diagnosticText);
    canvas.bringObjectToFront(diagnosticText);
    canvas.requestRenderAll();
    
    console.log("✅ Grid test completed");
    
    // Remove diagnostic after 5 seconds
    setTimeout(() => {
      if (canvas.contains(diagnosticText)) {
        canvas.remove(diagnosticText);
        canvas.requestRenderAll();
      }
    }, 5000);
  }
  catch (error) {
    console.error("Error in grid test:", error);
  }
};
