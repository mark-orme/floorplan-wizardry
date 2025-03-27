
/**
 * Grid creation utilities
 * Provides functions for creating and managing the grid on canvas
 * @module gridCreationUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line, Text } from 'fabric';
import { GRID_SPACING, GRID_MAJOR_SPACING, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT, MAX_GRID_CREATION_ATTEMPTS, MIN_GRID_CREATION_INTERVAL } from '@/constants/numerics';

/**
 * Create a complete grid with all components
 * Creates both normal and emergency grid elements
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create complete grid: Canvas is null");
    return [];
  }
  
  try {
    // Clear any existing grid objects from canvas
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    const canvasWidth = canvas.width || CANVAS_DEFAULT_WIDTH;
    const canvasHeight = canvas.height || CANVAS_DEFAULT_HEIGHT;
    
    // Create major grid lines (every 100 pixels)
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += GRID_MAJOR_SPACING) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#4090CC',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      }) as unknown as FabricObject;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += GRID_MAJOR_SPACING) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#4090CC',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      }) as unknown as FabricObject;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create minor grid lines (every 10 pixels)
    // Skip minor lines outside safe performance bounds
    if (canvasWidth * canvasHeight < 4000000) {
      // Vertical minor lines
      for (let x = 0; x <= canvasWidth; x += GRID_SPACING) {
        if (x % GRID_MAJOR_SPACING !== 0) { // Skip where major lines exist
          const line = new Line([x, 0, x, canvasHeight], {
            stroke: '#A0C5E0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
            objectType: 'grid'
          }) as unknown as FabricObject;
          
          canvas.add(line);
          gridObjects.push(line);
        }
      }
      
      // Horizontal minor lines
      for (let y = 0; y <= canvasHeight; y += GRID_SPACING) {
        if (y % GRID_MAJOR_SPACING !== 0) { // Skip where major lines exist
          const line = new Line([0, y, canvasWidth, y], {
            stroke: '#A0C5E0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
            objectType: 'grid'
          }) as unknown as FabricObject;
          
          canvas.add(line);
          gridObjects.push(line);
        }
      }
    }
    
    // Add origin marker
    const originMarker = new Text('0,0', {
      left: 5,
      top: 5,
      fontSize: 12,
      fill: '#555555',
      selectable: false,
      evented: false,
      objectType: 'grid'
    }) as unknown as FabricObject;
    
    canvas.add(originMarker);
    gridObjects.push(originMarker);
    
    // Force render the canvas
    canvas.requestRenderAll();
    
    // Store grid objects in reference
    gridLayerRef.current = gridObjects;
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Create a basic emergency grid on the canvas
 * Used as a fallback when normal grid creation fails
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas is null");
    return [];
  }
  
  try {
    // Clear any existing grid objects from canvas
    if (gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    const gridObjects: FabricObject[] = [];
    const canvasWidth = canvas.width || CANVAS_DEFAULT_WIDTH;
    const canvasHeight = canvas.height || CANVAS_DEFAULT_HEIGHT;
    
    // Create major grid lines (every 100 pixels)
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += GRID_MAJOR_SPACING) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#4090CC',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      }) as unknown as FabricObject;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += GRID_MAJOR_SPACING) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#4090CC',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid'
      }) as unknown as FabricObject;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create minor grid lines (every 10 pixels)
    // Skip minor lines outside safe performance bounds
    if (canvasWidth * canvasHeight < 4000000) {
      // Vertical minor lines
      for (let x = 0; x <= canvasWidth; x += GRID_SPACING) {
        if (x % GRID_MAJOR_SPACING !== 0) { // Skip where major lines exist
          const line = new Line([x, 0, x, canvasHeight], {
            stroke: '#A0C5E0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
            objectType: 'grid'
          }) as unknown as FabricObject;
          
          canvas.add(line);
          gridObjects.push(line);
        }
      }
      
      // Horizontal minor lines
      for (let y = 0; y <= canvasHeight; y += GRID_SPACING) {
        if (y % GRID_MAJOR_SPACING !== 0) { // Skip where major lines exist
          const line = new Line([0, y, canvasWidth, y], {
            stroke: '#A0C5E0',
            strokeWidth: 0.5,
            selectable: false,
            evented: false,
            objectType: 'grid'
          }) as unknown as FabricObject;
          
          canvas.add(line);
          gridObjects.push(line);
        }
      }
    }
    
    // Add origin marker
    const originMarker = new Text('0,0', {
      left: 5,
      top: 5,
      fontSize: 12,
      fill: '#555555',
      selectable: false,
      evented: false,
      objectType: 'grid'
    }) as unknown as FabricObject;
    
    canvas.add(originMarker);
    gridObjects.push(originMarker);
    
    // Force render the canvas
    canvas.requestRenderAll();
    
    // Store grid objects in reference
    gridLayerRef.current = gridObjects;
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Validate that the grid exists and is properly displayed on canvas
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if grid is valid
 */
export const validateGrid = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  if (gridLayerRef.current.length === 0) return false;
  
  // Check that at least 50% of grid objects are on canvas
  const gridObjectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj));
  return gridObjectsOnCanvas.length >= gridLayerRef.current.length / 2;
};

/**
 * Ensure grid exists on canvas, creating it if necessary
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if grid exists or was created successfully
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  try {
    // Check if grid already exists and is valid
    if (validateGrid(canvas, gridLayerRef)) {
      return true;
    }
    
    // Create grid if it doesn't exist
    const gridObjects = createBasicEmergencyGrid(canvas, gridLayerRef);
    
    // Check if grid was created successfully
    return gridObjects.length > 0;
  } catch (error) {
    console.error("Error ensuring grid:", error);
    return false;
  }
};

/**
 * Re-arrange grid objects in proper order
 * Major lines on top of minor lines, with text markers at the front
 * 
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
) => {
  if (!canvas || gridLayerRef.current.length === 0) return;
  
  try {
    // First send all grid objects to back
    gridLayerRef.current.forEach(obj => {
      canvas.sendObjectToBack(obj);
    });
    
    // Bring major grid lines forward
    gridLayerRef.current.forEach(obj => {
      if (
        obj.type === 'line' && 
        obj.strokeWidth && 
        obj.strokeWidth === 1
      ) {
        canvas.bringObjectToFront(obj);
      }
    });
    
    // Bring text labels to front
    gridLayerRef.current.forEach(obj => {
      if (obj.type === 'text') {
        canvas.bringObjectToFront(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error reordering grid objects:", error);
  }
};

/**
 * Retry an async operation with exponential backoff
 * 
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<any>} Result of operation
 */
export const retryWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 3,
  initialDelay: number = 300
): Promise<any> => {
  let retries = 0;
  let delay = initialDelay;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      // Increase retries and delay
      retries++;
      delay *= 1.5;
      
      // Wait before next try
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Check if grid exists on the canvas
 * 
 * @param {FabricCanvas | null} canvas - The fabric canvas
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if grid exists
 */
export const verifyGridExists = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  return validateGrid(canvas, gridLayerRef);
};

// Note: All functions are already exported with their declarations above
