
/**
 * Reliable Grid Creation Utilities
 * Provides robust grid creation with error handling and fallbacks
 * @module utils/grid/reliableGridCreation
 */
import { Canvas as FabricCanvas, Line, Object as FabricObject, Rect } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

// Grid creation cooldown tracking
let lastGridCreationTime = 0;
const GRID_CREATION_COOLDOWN = 500; // ms
let gridCreationAttempts = 0;
const MAX_GRID_CREATION_ATTEMPTS = 5;

/**
 * Check if grid creation is on cooldown
 * Prevents excessive grid creation calls
 * @returns {boolean} Whether grid creation is on cooldown
 */
export const isGridCreationOnCooldown = (): boolean => {
  const now = Date.now();
  return (now - lastGridCreationTime) < GRID_CREATION_COOLDOWN;
};

/**
 * Reset grid creation state
 * Useful when unmounting and remounting components
 */
export const resetGridCreationState = (): void => {
  gridCreationAttempts = 0;
  lastGridCreationTime = 0;
  console.log("Grid creation state reset");
};

/**
 * Create a grid layer on the canvas
 * @param {FabricCanvas} canvas - Fabric canvas to add grid to
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
export const createReliableGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  // Track attempt
  gridCreationAttempts++;
  lastGridCreationTime = Date.now();
  
  try {
    console.log("Creating reliable grid...");
    
    // Clean up any existing grid
    if (gridLayerRef.current.length > 0) {
      console.log(`Removing ${gridLayerRef.current.length} existing grid objects`);
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Validate canvas dimensions
    if (!canvas.width || !canvas.height || canvas.width <= 0 || canvas.height <= 0) {
      console.error("Invalid canvas dimensions:", canvas.width, canvas.height);
      throw new Error("Cannot create grid: Invalid canvas dimensions");
    }
    
    const gridObjects: FabricObject[] = [];
    const { width, height } = canvas;
    const gridSize = GRID_CONSTANTS.SMALL_GRID_SIZE || 20;
    const gridColor = GRID_CONSTANTS.SMALL_GRID_COLOR || '#e0e0e0';
    
    console.log(`Creating grid for canvas ${width}x${height} with grid size ${gridSize}`);
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      // Add metadata
      line.set('data', { isGridLine: true, orientation: 'vertical' });
      
      // Add to canvas
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new Line([0, y, width, y], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5,
        hoverCursor: 'default'
      });
      
      // Add metadata
      line.set('data', { isGridLine: true, orientation: 'horizontal' });
      
      // Add to canvas
      canvas.add(line);
      gridObjects.push(line);
      
      // Send to back (lowest z-index)
      canvas.sendObjectToBack(line);
    }
    
    // Re-render the canvas
    canvas.requestRenderAll();
    
    // Update grid layer reference
    gridLayerRef.current = gridObjects;
    
    console.log(`Created grid with ${gridObjects.length} lines`);
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    console.error("Failed to create grid:", error);
    
    // Create fallback grid if we've failed too many times
    if (gridCreationAttempts >= MAX_GRID_CREATION_ATTEMPTS) {
      return createEmergencyFallbackGrid(canvas, gridLayerRef);
    }
    
    return [];
  }
};

/**
 * Create a simplified emergency fallback grid
 * Used when normal grid creation fails
 * @param {FabricCanvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Created grid objects
 */
const createEmergencyFallbackGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  try {
    console.warn("Creating emergency fallback grid");
    
    // Clear existing grid
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    const gridObjects: FabricObject[] = [];
    const { width, height } = canvas;
    const largerGridSize = 50; // Larger size for emergency grid
    const emergencyGridColor = '#ff000022'; // Slightly red for emergency
    
    // Create just a few vertical lines
    for (let x = 0; x <= width; x += largerGridSize) {
      const line = new Line([x, 0, x, height], {
        stroke: emergencyGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create just a few horizontal lines
    for (let y = 0; y <= height; y += largerGridSize) {
      const line = new Line([0, y, width, y], {
        stroke: emergencyGridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      canvas.add(line);
      gridObjects.push(line);
      canvas.sendObjectToBack(line);
    }
    
    canvas.requestRenderAll();
    gridLayerRef.current = gridObjects;
    
    toast.warning("Using emergency grid mode", { duration: 3000 });
    logger.warn("Emergency grid created with", gridObjects.length, "lines");
    
    return gridObjects;
  } catch (error) {
    logger.error("Failed to create emergency grid:", error);
    console.error("Critical failure: Could not create emergency grid:", error);
    return [];
  }
};

/**
 * Ensure grid is visible on canvas
 * Checks if grid is properly displayed and fixes if needed
 * @param {FabricCanvas} canvas - Fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const ensureGridVisibility = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  try {
    // Only proceed if we have grid objects but they're not visible
    if (gridLayerRef.current.length > 0) {
      // Check if any grid objects are not on canvas
      const missingGridLines = gridLayerRef.current.filter(obj => !canvas.contains(obj));
      
      if (missingGridLines.length > 0) {
        console.log(`Found ${missingGridLines.length} missing grid lines, restoring...`);
        
        // Re-add missing lines
        missingGridLines.forEach(line => {
          if (!canvas.contains(line)) {
            canvas.add(line);
            canvas.sendObjectToBack(line);
          }
        });
        
        canvas.requestRenderAll();
      }
    } else if (gridLayerRef.current.length === 0 && !isGridCreationOnCooldown()) {
      // No grid at all, create a new one if not on cooldown
      console.log("No grid found, creating new grid");
      createReliableGrid(canvas, gridLayerRef);
    }
  } catch (error) {
    logger.error("Error ensuring grid visibility:", error);
  }
};

/**
 * Test grid creation with visual feedback
 * Useful for debugging
 * @param {FabricCanvas} canvas - Fabric canvas
 */
export const testGridCreation = (canvas: FabricCanvas): void => {
  console.log("Testing grid creation...");
  
  // Create a temporary indicator
  const testRect = new Rect({
    left: 10,
    top: 10,
    width: 30,
    height: 30,
    fill: 'rgba(255,0,0,0.3)',
    stroke: 'red',
    strokeWidth: 1,
    selectable: false,
    evented: false
  });
  
  canvas.add(testRect);
  
  // Flash it briefly then remove
  setTimeout(() => {
    canvas.remove(testRect);
    canvas.requestRenderAll();
  }, 1000);
};
