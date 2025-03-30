
/**
 * Grid creation utility functions
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line as FabricLine } from "fabric";

/**
 * Create a basic emergency grid on the canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  console.log("Creating basic emergency grid");
  
  const gridObjects: FabricObject[] = [];
  const gridSize = 20;
  const canvasWidth = canvas.width || 800;
  const canvasHeight = canvas.height || 600;
  
  // Create horizontal grid lines
  for (let i = 0; i <= canvasHeight; i += gridSize) {
    const line = new FabricLine([0, i, canvasWidth, i], {
      stroke: '#e0e0e0',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= canvasWidth; i += gridSize) {
    const line = new FabricLine([i, 0, i, canvasHeight], {
      stroke: '#e0e0e0',
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Add grid objects to canvas
  canvas.renderAll();
  
  console.log(`Created ${gridObjects.length} grid objects`);
  
  return gridObjects;
};

/**
 * Create a more prominent major grid with minor gridlines
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createEnhancedGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create enhanced grid: Canvas is null");
    return [];
  }
  
  console.log("Creating enhanced grid with major and minor lines");
  
  const gridObjects: FabricObject[] = [];
  const minorGridSize = 10;
  const majorGridSize = 50;
  const canvasWidth = canvas.width || 800;
  const canvasHeight = canvas.height || 600;
  
  // Create minor horizontal grid lines
  for (let i = 0; i <= canvasHeight; i += minorGridSize) {
    const isMajor = i % majorGridSize === 0;
    
    const line = new FabricLine([0, i, canvasWidth, i], {
      stroke: isMajor ? '#cccccc' : '#f0f0f0',
      strokeWidth: isMajor ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create minor vertical grid lines
  for (let i = 0; i <= canvasWidth; i += minorGridSize) {
    const isMajor = i % majorGridSize === 0;
    
    const line = new FabricLine([i, 0, i, canvasHeight], {
      stroke: isMajor ? '#cccccc' : '#f0f0f0',
      strokeWidth: isMajor ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Add grid objects to canvas
  canvas.renderAll();
  
  console.log(`Created ${gridObjects.length} enhanced grid objects`);
  
  return gridObjects;
};

/**
 * Create complete grid on canvas and store in gridLayerRef
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance 
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas,
  gridLayerRef?: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  const gridObjects = createEnhancedGrid(canvas);
  
  // Store grid objects in reference if provided
  if (gridLayerRef) {
    gridLayerRef.current = gridObjects;
  }
  
  return gridObjects;
};

/**
 * Verify if grid exists on canvas
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {boolean} True if grid exists
 */
export const verifyGridExists = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const objects = canvas.getObjects();
  return objects.some(obj => (obj as any).objectType === 'grid');
};

/**
 * Ensure grid exists on canvas, creating one if needed
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {FabricObject[]} Array of grid objects
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid already exists
  if (verifyGridExists(canvas)) {
    return canvas.getObjects().filter(obj => (obj as any).objectType === 'grid');
  }
  
  // Create new grid
  return createEnhancedGrid(canvas);
};

/**
 * Retry an operation with exponential backoff
 * @param {Function} operation - Function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<any>} Promise resolving to operation result
 */
export const retryWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, i) * 100; // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Reorder grid objects for better rendering
 * @param {FabricCanvas} canvas - The Fabric.js canvas instance
 * @returns {void}
 */
export const reorderGridObjects = (canvas: FabricCanvas): void => {
  if (!canvas) return;
  
  // Get all objects
  const objects = canvas.getObjects();
  
  // Separate grid and non-grid objects
  const gridObjects = objects.filter(obj => (obj as any).objectType === 'grid');
  const nonGridObjects = objects.filter(obj => (obj as any).objectType !== 'grid');
  
  // Clear canvas
  canvas.clear();
  
  // Add grid objects first (in the background)
  gridObjects.forEach(obj => canvas.add(obj));
  
  // Add non-grid objects on top
  nonGridObjects.forEach(obj => canvas.add(obj));
  
  // Render changes
  canvas.renderAll();
};
