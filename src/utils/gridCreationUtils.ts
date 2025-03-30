
/**
 * Grid creation utilities
 * @module utils/gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from "fabric";
import { DebugInfoState } from "@/types/drawingTypes";

/**
 * Create a basic emergency grid when everything else fails
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @returns {FabricObject[]} Created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    const gridObjects: FabricObject[] = [];
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridSize = 50;
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: '#e5e5e5',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        objectType: 'grid'
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: '#e5e5e5',
        strokeWidth: 0.5,
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
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a complete grid with major and minor lines
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @returns {FabricObject[]} Created grid objects
 */
export const createCompleteGrid = (canvas: FabricCanvas): FabricObject[] => {
  // For now, delegate to the emergency grid
  return createBasicEmergencyGrid(canvas);
};

/**
 * Verify that grid exists on canvas
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {boolean} True if grid exists
 */
export const verifyGridExists = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  if (!canvas || !gridObjects || !Array.isArray(gridObjects)) return false;
  
  // Check if at least some grid objects are on the canvas
  return gridObjects.some(obj => canvas.contains(obj));
};

/**
 * Validate grid objects
 * @param {FabricObject[]} gridObjects - Grid objects to validate
 * @returns {boolean} True if grid is valid
 */
export const validateGrid = (gridObjects: FabricObject[]): boolean => {
  return Array.isArray(gridObjects) && gridObjects.length > 0;
};

/**
 * Retry grid creation with backoff
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @param {Function} createFn - Grid creation function
 * @returns {Promise<FabricObject[]>} Created grid objects
 */
export const retryWithBackoff = async (
  canvas: FabricCanvas, 
  createFn: (canvas: FabricCanvas) => FabricObject[]
): Promise<FabricObject[]> => {
  let attempt = 0;
  const maxAttempts = 3;
  
  while (attempt < maxAttempts) {
    try {
      const gridObjects = createFn(canvas);
      if (gridObjects && gridObjects.length > 0) {
        return gridObjects;
      }
    } catch (error) {
      console.error(`Grid creation attempt ${attempt + 1} failed:`, error);
    }
    
    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, attempt)));
    attempt++;
  }
  
  // Last resort - emergency grid
  return createBasicEmergencyGrid(canvas);
};

/**
 * Reorder grid objects for correct rendering
 * @param {FabricCanvas} canvas - Canvas containing grid
 * @param {FabricObject[]} gridObjects - Grid objects to reorder
 */
export const reorderGridObjects = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas || !gridObjects || !Array.isArray(gridObjects)) return;
  
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.sendToBack(obj);
    }
  });
};

/**
 * Ensure grid exists, creating it if needed
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid already exists
  if (gridLayerRef.current.length > 0 && verifyGridExists(canvas, gridLayerRef.current)) {
    return gridLayerRef.current;
  }
  
  // Create new grid
  const gridObjects = createBasicEmergencyGrid(canvas);
  gridLayerRef.current = gridObjects;
  return gridObjects;
};

/**
 * Create grid layer on canvas
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @returns {FabricObject[]} Created grid objects
 */
export const createGridLayer = (canvas: FabricCanvas): FabricObject[] => {
  return createBasicEmergencyGrid(canvas);
};

/**
 * Create fallback grid when other methods fail
 * @param {FabricCanvas} canvas - Canvas to create grid on
 * @returns {FabricObject[]} Created grid objects
 */
export const createFallbackGrid = (canvas: FabricCanvas): FabricObject[] => {
  return createBasicEmergencyGrid(canvas);
};

/**
 * Check if canvas has a complete grid
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {FabricObject[]} gridObjects - Grid objects to verify
 * @returns {boolean} True if canvas has complete grid
 */
export const hasCompleteGrid = (canvas: FabricCanvas, gridObjects: FabricObject[]): boolean => {
  return verifyGridExists(canvas, gridObjects);
};

/**
 * Force grid render
 * @param {FabricCanvas} canvas - Canvas containing grid
 */
export const forceGridRender = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  canvas.requestRenderAll();
};
