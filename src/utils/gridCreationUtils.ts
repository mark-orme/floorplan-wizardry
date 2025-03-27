
/**
 * Grid creation utilities
 * Provides functions for creating and managing canvas grids
 * @module gridCreationUtils
 */
import { Canvas, Object as FabricObject, Line } from "fabric";
import { LARGE_GRID, LARGE_GRID_LINE_WIDTH } from "@/constants/numerics";

/**
 * Verify that a grid exists on the canvas
 * @param canvas - The Fabric canvas
 * @param gridLayerRef - Reference to grid objects
 * @returns True if grid exists and is valid
 */
export const verifyGridExists = (
  canvas: Canvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  if (!canvas) return false;
  
  const gridObjects = gridLayerRef.current;
  
  // Check if grid has any objects
  if (!gridObjects || gridObjects.length === 0) {
    return false;
  }
  
  // Check if grid objects are on canvas
  const gridObjectsOnCanvas = gridObjects.filter(obj => canvas.contains(obj));
  return gridObjectsOnCanvas.length > 0;
};

/**
 * Retry an operation with exponential backoff
 * @param operation - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param initialDelay - Initial delay in milliseconds
 * @returns Promise resolving to the operation result
 */
export const retryWithBackoff = async <T>(
  operation: () => Promise<T> | T,
  maxAttempts: number = 3,
  initialDelay: number = 300
): Promise<T> => {
  let attempts = 0;
  let lastError: Error | null = null;
  
  while (attempts < maxAttempts) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempts++;
      
      if (attempts >= maxAttempts) {
        break;
      }
      
      // Calculate backoff delay with randomization
      const delay = initialDelay * Math.pow(2, attempts - 1) * (0.9 + Math.random() * 0.2);
      
      // Wait for backoff delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError || new Error(`Failed after ${maxAttempts} attempts`);
};

/**
 * Reorder grid objects for better performance and visibility
 * @param gridObjects - Array of grid objects to reorder
 * @returns Reordered array of grid objects
 */
export const reorderGridObjects = (gridObjects: FabricObject[]): FabricObject[] => {
  if (!gridObjects || gridObjects.length === 0) {
    return [];
  }
  
  // Separate major and minor grid lines
  const majorLines: FabricObject[] = [];
  const minorLines: FabricObject[] = [];
  
  gridObjects.forEach(obj => {
    if (obj.strokeWidth === LARGE_GRID_LINE_WIDTH) {
      majorLines.push(obj);
    } else {
      minorLines.push(obj);
    }
  });
  
  // Return with major lines on top for better visibility
  return [...minorLines, ...majorLines];
};

/**
 * Create a basic emergency grid on the canvas
 * @param canvas - The Fabric canvas
 * @param gridLayerRef - Reference to store grid objects
 * @returns Created grid objects
 */
export const createBasicEmergencyGrid = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): FabricObject[] => {
  if (!canvas) {
    console.error("Cannot create emergency grid: canvas is null");
    return [];
  }
  
  // Clean up any existing grid objects
  gridLayerRef.current.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  gridLayerRef.current = [];
  
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create a basic grid with larger spacing for performance
  const gridLines: FabricObject[] = [];
  const spacing = Math.min(width, height) / 10;
  
  // Create vertical lines
  for (let i = 0; i <= width; i += spacing) {
    const line = new Line([i, 0, i, height], {
      stroke: 'rgba(150, 150, 150, 0.4)',
      strokeWidth: 1,
      selectable: false,
      evented: false
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Create horizontal lines
  for (let i = 0; i <= height; i += spacing) {
    const line = new Line([0, i, width, i], {
      stroke: 'rgba(150, 150, 150, 0.4)',
      strokeWidth: 1,
      selectable: false,
      evented: false
    });
    
    gridLines.push(line);
    canvas.add(line);
  }
  
  // Update the reference
  gridLayerRef.current = gridLines;
  
  // Force a render
  canvas.requestRenderAll();
  
  return gridLines;
};
