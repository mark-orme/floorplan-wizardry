
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import logger from "@/utils/logger";

/**
 * Grid options interface
 */
export interface GridOptions {
  size?: number;
  color?: string;
  opacity?: number;
  snapToGrid?: boolean;
}

/**
 * Create grid on the canvas
 * @param canvas - Fabric canvas
 * @param options - Grid options
 * @returns Created grid objects
 */
export const createGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot create grid: Canvas is null");
    return [];
  }
  
  try {
    // Use provided options or defaults
    const gridSize = options.size || 20;
    const gridColor = options.color || '#CCCCCC';
    const gridOpacity = options.opacity || 0.5;
    
    const canvasWidth = canvas.width || 800;
    const canvasHeight = canvas.height || 600;
    const gridObjects: FabricObject[] = [];
    
    // Create vertical lines
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [i, 0, i, canvasHeight],
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: gridOpacity
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      const line = new FabricObject({
        type: 'line',
        points: [0, i, canvasWidth, i],
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        opacity: gridOpacity
      } as any);
      
      (line as any).objectType = 'grid';
      (line as any).isGrid = true;
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    logger.info(`Created ${gridObjects.length} grid objects`);
    
    return gridObjects;
  } catch (error) {
    logger.error("Error creating grid:", error);
    return [];
  }
};

/**
 * Create a basic emergency grid
 * @param canvas - Fabric canvas
 * @returns Created grid objects
 */
export const createBasicEmergencyGrid = (canvas: FabricCanvas): FabricObject[] => {
  return createGrid(canvas, { size: 40, opacity: 0.3 });
};

/**
 * Ensure grid exists on the canvas
 * @param canvas - Fabric canvas
 * @returns Grid objects (created if needed)
 */
export const ensureGrid = (canvas: FabricCanvas): FabricObject[] => {
  if (!canvas) {
    logger.error("Cannot ensure grid: Canvas is null");
    return [];
  }
  
  // Check if grid already exists
  const existingGridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  if (existingGridObjects.length > 0) {
    logger.info(`Grid already exists with ${existingGridObjects.length} objects`);
    return existingGridObjects;
  }
  
  // Create new grid if none exists
  logger.info("No grid found, creating new grid");
  return createGrid(canvas);
};

/**
 * Create enhanced grid with additional features
 * @param canvas - Fabric canvas
 * @param options - Grid options
 * @returns Created grid objects
 */
export const createEnhancedGrid = (canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] => {
  const gridObjects = createGrid(canvas, options);
  
  // Add any enhanced features here
  
  return gridObjects;
};

/**
 * Validate that grid is properly set up
 * @param canvas - Fabric canvas
 * @returns Whether grid is valid
 */
export const validateGrid = (canvas: FabricCanvas): boolean => {
  if (!canvas) {
    logger.error("Cannot validate grid: Canvas is null");
    return false;
  }
  
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid' || (obj as any).isGrid === true
  );
  
  const isValid = gridObjects.length > 0;
  if (!isValid) {
    logger.warn("Grid validation failed: No grid objects found");
  }
  
  return isValid;
};
