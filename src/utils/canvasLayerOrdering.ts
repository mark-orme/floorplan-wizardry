
/**
 * Canvas layer ordering utilities
 * Functions for maintaining the correct z-index ordering of canvas objects
 * @module canvasLayerOrdering
 */
import { 
  Canvas as FabricCanvas, 
  Object as FabricObject, 
  Line, 
  Path,
  ObjectProps as FabricObjectProps 
} from "fabric";
import logger from "@/utils/logger";

// Layer ordering constants
export const LAYER_ORDER = {
  GRID: 1,
  DRAWING: 10,
  SELECTION: 20,
  MEASUREMENT: 30,
  TOOLTIP: 40
};

// Object type definitions for layer ordering
export enum ObjectType {
  GRID_LINE = 'gridLine',
  WALL = 'wall',
  ROOM = 'room',
  MEASUREMENT = 'measurement',
  TOOLTIP = 'tooltip',
  SELECTION = 'selection'
}

/**
 * Set appropriate z-index for an object based on its type
 * @param {FabricObject} obj - The fabric object to set z-index for
 * @param {ObjectType} type - Type of the object
 * @returns {FabricObject} The same object with updated z-index
 */
export const setObjectLayer = (
  obj: FabricObject, 
  type: ObjectType
): FabricObject => {
  if (!obj) return obj;
  
  let zIndex = 10; // Default z-index
  
  switch (type) {
    case ObjectType.GRID_LINE:
      zIndex = LAYER_ORDER.GRID;
      break;
    case ObjectType.WALL:
    case ObjectType.ROOM:
      zIndex = LAYER_ORDER.DRAWING;
      break;
    case ObjectType.SELECTION:
      zIndex = LAYER_ORDER.SELECTION;
      break;
    case ObjectType.MEASUREMENT:
      zIndex = LAYER_ORDER.MEASUREMENT;
      break;
    case ObjectType.TOOLTIP:
      zIndex = LAYER_ORDER.TOOLTIP;
      break;
    default:
      zIndex = LAYER_ORDER.DRAWING;
  }
  
  // Set the z-index on the object
  if (obj.set) {
    obj.set('zIndex', zIndex);
    
    // Apply common properties for all grid lines
    if (type === ObjectType.GRID_LINE) {
      obj.set({
        selectable: false,
        evented: false,
        hoverCursor: 'default'
      });
    }
  }
  
  return obj;
};

/**
 * Sort canvas objects by their z-index property
 * @param {FabricCanvas} canvas - The fabric canvas instance
 */
export const sortObjectsByLayer = (canvas: FabricCanvas): void => {
  if (!canvas || !canvas.getObjects) return;
  
  try {
    const objects = canvas.getObjects();
    
    // Sort objects by z-index
    objects.sort((a, b) => {
      const aZ = (a as FabricObject & { zIndex?: number }).zIndex || 0;
      const bZ = (b as FabricObject & { zIndex?: number }).zIndex || 0;
      return aZ - bZ;
    });
    
    // Request a re-render to apply the new ordering
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Failed to sort objects by layer:", error);
  }
};

/**
 * Create a grid line with appropriate properties and layer ordering
 * @param {[number, number, number, number]} points - Line points [x1, y1, x2, y2]
 * @param {Partial<FabricObjectProps>} options - Line options
 * @returns {Line} Created line object
 */
export const createGridLine = (
  points: [number, number, number, number], 
  options: Partial<FabricObjectProps> = {}
): Line => {
  const line = new Line(points, {
    strokeWidth: 0.5,
    stroke: 'rgba(200,200,200,0.3)',
    selectable: false,
    evented: false,
    hoverCursor: 'default',
    ...options
  });
  
  // Apply grid line layer ordering
  setObjectLayer(line, ObjectType.GRID_LINE);
  
  return line;
};

/**
 * Create a wall line with appropriate properties and layer ordering
 * @param {[number, number, number, number]} points - Line points [x1, y1, x2, y2]
 * @param {Partial<FabricObjectProps>} options - Line options
 * @returns {Line} Created wall line object
 */
export const createWallLine = (
  points: [number, number, number, number], 
  options: Partial<FabricObjectProps> = {}
): Line => {
  const line = new Line(points, {
    strokeWidth: 2,
    stroke: '#000000',
    selectable: true,
    ...options
  });
  
  // Apply wall line layer ordering
  setObjectLayer(line, ObjectType.WALL);
  
  return line;
};

/**
 * Apply correct layering to all objects in the canvas
 * @param {FabricCanvas} canvas - The fabric canvas instance
 */
export const updateAllObjectLayers = (canvas: FabricCanvas): void => {
  if (!canvas || !canvas.getObjects) return;
  
  try {
    const objects = canvas.getObjects();
    
    // Process each object based on its type
    objects.forEach(obj => {
      // Apply appropriate layer based on object properties
      if (obj.get('data')?.type === 'grid') {
        setObjectLayer(obj, ObjectType.GRID_LINE);
      } else if (obj.get('data')?.type === 'wall') {
        setObjectLayer(obj, ObjectType.WALL);
      } else if (obj.get('data')?.type === 'measurement') {
        setObjectLayer(obj, ObjectType.MEASUREMENT);
      } else if (obj instanceof Line) {
        // Default handling for untagged lines
        setObjectLayer(obj, ObjectType.WALL);
      } else if (obj instanceof Path) {
        // Default handling for paths
        setObjectLayer(obj, ObjectType.WALL); // Changed from DRAWING to WALL
      }
    });
    
    // Apply the layer ordering
    sortObjectsByLayer(canvas);
  } catch (error) {
    logger.error("Failed to update all object layers:", error);
  }
};

/**
 * Ensure grid elements are properly arranged in z-order
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid layer objects
 */
export const arrangeGridElements = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas || !gridLayerRef.current) return;
  
  try {
    // Send all grid elements to the back
    gridLayerRef.current.forEach(gridObj => {
      if (canvas.contains(gridObj)) {
        canvas.sendObjectToBack(gridObj);
      }
    });
    
    // Request a render to apply changes
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Failed to arrange grid elements:", error);
  }
};
