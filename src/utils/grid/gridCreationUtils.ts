
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

/**
 * Creates a basic emergency grid when standard grid creation fails
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: Canvas not available");
    return [];
  }
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create a simpler grid with fewer lines for emergency
    const gridSpacing = 50; // Larger spacing for emergency grid
    
    // Create horizontal grid lines
    for (let i = 0; i <= height; i += gridSpacing) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical grid lines
    for (let i = 0; i <= width; i += gridSpacing) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.requestRenderAll();
    console.log(`Created emergency grid with ${gridObjects.length} objects`);
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating emergency grid:", error);
    return [];
  }
};

/**
 * Create a complete grid with small and large grid lines
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createCompleteGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  if (!canvas) return [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create small grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.SMALL_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.SMALL_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create large grid lines
    for (let i = 0; i <= width; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([i, 0, i, height], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i <= height; i += GRID_CONSTANTS.LARGE_GRID_SIZE) {
      const line = new Line([0, i, width, i], {
        stroke: GRID_CONSTANTS.LARGE_GRID_COLOR,
        strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    return gridObjects;
  } catch (error) {
    console.error("Error creating complete grid:", error);
    return [];
  }
};

/**
 * Verify that grid exists
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects reference
 * @returns Whether grid exists
 */
export const verifyGridExists = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): boolean => {
  if (!canvas) return false;
  if (!gridObjects || gridObjects.length === 0) return false;
  
  const objectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return objectsOnCanvas.length > 0;
};

/**
 * Retry an operation with backoff
 * @param operation Operation to retry
 * @param maxRetries Maximum number of retries
 * @returns Promise that resolves to operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> => {
  let retries = 0;
  
  while (true) {
    try {
      return await operation();
    } catch (error) {
      if (retries >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, retries) * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }
};

/**
 * Reorder grid objects to be at the back of canvas
 * @param canvas Fabric canvas
 * @param gridObjects Grid objects to reorder
 */
export const reorderGridObjects = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Move all grid objects to the back
    gridObjects.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error("Error reordering grid objects:", error);
  }
};

/**
 * Ensure grid is created
 * @param canvas Fabric canvas
 * @param gridLayerRef Reference to grid objects
 * @returns Newly created or existing grid objects
 */
export const ensureGrid = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) return [];
  
  // Check if grid exists and is on canvas
  if (gridLayerRef.current.length > 0) {
    const objectsOnCanvas = gridLayerRef.current.filter(obj => canvas.contains(obj));
    if (objectsOnCanvas.length === gridLayerRef.current.length) {
      return gridLayerRef.current;
    }
  }
  
  // Clear any existing grid
  if (gridLayerRef.current.length > 0) {
    gridLayerRef.current.forEach(obj => {
      if (canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    gridLayerRef.current = [];
  }
  
  // Create new grid
  const gridObjects = createCompleteGrid(canvas);
  gridLayerRef.current = gridObjects;
  
  return gridObjects;
};

/**
 * Create enhanced grid with additional features
 * @param canvas Fabric canvas
 * @returns Array of created grid objects
 */
export const createEnhancedGrid = (
  canvas: FabricCanvas
): FabricObject[] => {
  // Just use the complete grid for now, can be enhanced later
  return createCompleteGrid(canvas);
};
