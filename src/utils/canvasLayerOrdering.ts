/**
 * Canvas layer ordering utility module
 * Provides functions for managing z-index of canvas objects
 * @module canvasLayerOrdering
 */
import { Canvas, Object as FabricObject } from "fabric";
import { 
  PIXELS_PER_METER,
  LARGE_GRID,
  SMALL_GRID 
} from "@/constants/numerics";

/**
 * Object type enumeration for layer ordering
 */
enum ObjectType {
  GRID = 'grid',
  DRAWING = 'drawing',
  ROOM = 'room',
  MARKER = 'marker',
  MEASUREMENT = 'measurement'
}

/**
 * Ensures grid elements are at the bottom layer of the canvas
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid objects
 */
export const arrangeGridElements = (
  canvas: Canvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): void => {
  if (!canvas || !gridLayerRef || !gridLayerRef.current) return;
  
  const allObjects = canvas.getObjects();
  if (!allObjects || allObjects.length === 0) return;
  
  // Process grid objects first (send to back)
  gridLayerRef.current.forEach(gridObject => {
    if (canvas.contains(gridObject)) {
      canvas.sendObjectToBack(gridObject);
    }
  });
  
  // Request a render to update the display
  canvas.requestRenderAll();
};

/**
 * Checks if an object is a grid element
 * @param {FabricObject} obj - The object to check
 * @returns {boolean} True if object is a grid element
 */
export const isGridElement = (obj: FabricObject): boolean => {
  if (!obj) return false;
  
  // Check for grid by objectType property
  if ((obj as any).objectType === ObjectType.GRID) return true;
  
  // Check for grid by id property
  if ((obj as any).id && typeof (obj as any).id === 'string') {
    return (obj as any).id.startsWith('grid-');
  }
  
  return false;
};

/**
 * Separates grid objects from non-grid objects
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @returns {{gridObjects: FabricObject[], drawingObjects: FabricObject[]}} Separated objects
 */
export const separateGridAndDrawingObjects = (
  canvas: Canvas
): {
  gridObjects: FabricObject[];
  drawingObjects: FabricObject[];
} => {
  const allObjects = canvas.getObjects();
  const gridObjects: FabricObject[] = [];
  const drawingObjects: FabricObject[] = [];
  
  allObjects.forEach(obj => {
    if (isGridElement(obj)) {
      gridObjects.push(obj);
    } else {
      drawingObjects.push(obj);
    }
  });
  
  return { gridObjects, drawingObjects };
};

/**
 * Creates points array for a rectangle using corner coordinates
 * @param {number} left - Left coordinate
 * @param {number} top - Top coordinate
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @returns {number[][]} Array of corner points for the rectangle
 */
export const createRectanglePoints = (
  left: number,
  top: number,
  width: number,
  height: number
): [number, number, number, number] => {
  return [left, top, left + width, top + height];
};

/**
 * Creates a grid coordinate rectangle for the canvas
 * @param {Canvas} canvas - The Fabric.js canvas instance
 * @returns {number[][]} Coordinates for the rectangle
 */
export const createCanvasCoordinateRect = (canvas: Canvas): [number, number, number, number] => {
  const width = canvas.width || 1000;
  const height = canvas.height || 800;
  
  // Create rectangle with specified dimensions
  return createRectanglePoints(0, 0, width, height) as [number, number, number, number];
};
