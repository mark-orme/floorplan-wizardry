
import { Canvas, Object as FabricObject, Line, Circle } from 'fabric';
import { toast } from 'sonner';

/**
 * Creates a basic emergency grid for debugging and recovery purposes
 * Used when normal grid creation fails
 * 
 * @param {Canvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to store grid objects
 * @returns {FabricObject[]} The created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas, 
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create grid: Canvas is null");
    return [];
  }

  try {
    // Store created grid objects
    const gridObjects: FabricObject[] = [];
    
    // Clear any existing grid objects
    if (gridLayerRef.current?.length > 0) {
      gridLayerRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      gridLayerRef.current = [];
    }
    
    // Create major grid lines (every 100px)
    const { width, height } = canvas;
    const majorStep = 100;
    const minorStep = 25;
    
    // Create horizontal major lines
    for (let y = 0; y <= height; y += majorStep) {
      const line = new Line([0, y, width, y], {
        stroke: '#666',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical major lines
    for (let x = 0; x <= width; x += majorStep) {
      const line = new Line([x, 0, x, height], {
        stroke: '#666',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectType: 'grid',
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal minor lines
    for (let y = 0; y <= height; y += minorStep) {
      if (y % majorStep !== 0) { // Skip major lines
        const line = new Line([0, y, width, y], {
          stroke: '#ddd',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
    }
    
    // Create vertical minor lines
    for (let x = 0; x <= width; x += minorStep) {
      if (x % majorStep !== 0) { // Skip major lines
        const line = new Line([x, 0, x, height], {
          stroke: '#ddd',
          strokeWidth: 0.5,
          selectable: false,
          evented: false,
          objectType: 'grid',
        });
        
        canvas.add(line);
        gridObjects.push(line);
      }
    }
    
    // Add an origin marker
    const originMarker = new Circle({
      left: 0,
      top: 0,
      radius: 5,
      fill: 'red',
      stroke: 'red',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      objectType: 'grid',
    });
    
    canvas.add(originMarker);
    gridObjects.push(originMarker);
    
    // Update grid layer reference
    gridLayerRef.current = gridObjects;
    
    // Force render to show grid
    canvas.renderAll();
    
    console.log(`Emergency grid created with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Verify if grid exists on the canvas
 * 
 * @param {Canvas | null} canvas - Fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 * @returns {boolean} True if grid exists and is attached to canvas
 */
export const verifyGridExists = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) {
    console.error("Cannot verify grid: Canvas is null");
    return false;
  }
  
  try {
    // Check if we have grid objects in our reference
    if (!gridLayerRef.current || gridLayerRef.current.length === 0) {
      console.log("Grid verification: No grid objects in ref");
      return false;
    }
    
    // Check if at least 50% of grid objects are on the canvas
    const gridObjectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj));
    const percentage = gridObjectsOnCanvas.length / gridLayerRef.current.length;
    
    if (percentage < 0.5) {
      console.log(`Grid verification: Only ${Math.round(percentage * 100)}% of grid objects found on canvas`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error verifying grid:", error);
    return false;
  }
};

/**
 * Retry an operation with exponential backoff
 * 
 * @param {Function} operation - The operation to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise<any>} Result of the operation
 */
export const retryWithBackoff = async (
  operation: () => Promise<any>,
  maxRetries: number = 5,
  initialDelay: number = 300
): Promise<any> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = initialDelay * Math.pow(1.5, attempt);
      console.log(`Operation failed, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`, error);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error(`Operation failed after ${maxRetries} attempts`, lastError);
  toast.error(`Operation failed after ${maxRetries} attempts`);
  throw lastError;
};
