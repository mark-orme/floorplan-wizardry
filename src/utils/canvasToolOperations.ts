
/**
 * Canvas tool operations
 * Functions for handling tool-specific canvas operations
 * @module canvasToolOperations
 */
import { 
  Canvas as FabricCanvas, 
  Object as FabricObject,
  Line,
  Path,
  Circle,
  ObjectProps as FabricObjectProps,
  Text
} from "fabric";
import { ObjectType, setObjectLayer } from './canvasLayerOrdering';
import { Point } from '@/types/drawingTypes';
import { DrawingTool } from '@/hooks/useCanvasState';
import { snapToGrid } from './grid/core';
import logger from './logger';

// Type definition for measurement text options
interface MeasurementTextOptions {
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  backgroundColor?: string;
  padding?: number;
}

/**
 * Handle switching between different drawing tools
 * @param {DrawingTool} tool - The tool to switch to
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid layer objects
 * @param {number} lineThickness - Line thickness in pixels
 * @param {string} lineColor - Line color in hex format
 * @param {React.Dispatch<React.SetStateAction<DrawingTool>>} setTool - Function to update tool state
 */
export const handleToolChange = (
  newTool: DrawingTool,
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  lineThickness: number,
  lineColor: string,
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>
): void => {
  if (!canvas) return;
  
  // Update the tool state
  setTool(newTool);
  
  // Configure canvas based on selected tool
  setActiveTool(canvas, newTool);
  
  // Update brush settings if drawing
  if (newTool === 'draw' && canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.width = lineThickness;
    canvas.freeDrawingBrush.color = lineColor;
  }
  
  // Ensure grid elements stay in the background
  setTimeout(() => {
    if (gridLayerRef.current && canvas) {
      gridLayerRef.current.forEach(gridObj => {
        if (canvas.contains(gridObj)) {
          canvas.sendObjectToBack(gridObj);
        }
      });
      canvas.requestRenderAll();
    }
  }, 100);
};

/**
 * Handle zooming the canvas in or out
 * @param {string} direction - The zoom direction ("in" or "out")
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {number} zoomLevel - Current zoom level
 * @param {React.Dispatch<React.SetStateAction<number>>} setZoomLevel - Function to update zoom level
 */
export const handleZoom = (
  direction: "in" | "out",
  canvas: FabricCanvas | null,
  zoomLevel: number,
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>
): void => {
  if (!canvas) return;
  
  const ZOOM_INCREMENT = 0.1;
  let newZoom = zoomLevel;
  
  if (direction === "in") {
    newZoom = Math.min(zoomLevel + ZOOM_INCREMENT, 5.0);
  } else {
    newZoom = Math.max(zoomLevel - ZOOM_INCREMENT, 0.1);
  }
  
  // Round to 1 decimal place for clean values
  newZoom = Math.round(newZoom * 10) / 10;
  
  // Apply zoom to canvas
  canvas.setZoom(newZoom);
  setZoomLevel(newZoom);
  
  // Fire custom zoom event
  canvas.fire('custom:zoom-changed', { zoom: newZoom });
  
  canvas.requestRenderAll();
};

/**
 * Clear drawings while preserving the grid
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Reference to grid layer objects
 * @param {Function} createGrid - Function to create grid if needed
 */
export const clearDrawings = (
  canvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  createGrid: (canvas: FabricCanvas) => FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Store all objects that aren't grid elements
    const allObjects = canvas.getObjects();
    const toKeep: FabricObject[] = [];
    const toRemove: FabricObject[] = [];
    
    // Sort objects by whether they're grid elements
    allObjects.forEach(obj => {
      const isGridElement = gridLayerRef.current.includes(obj as FabricObject);
      if (isGridElement) {
        toKeep.push(obj as FabricObject);
      } else {
        toRemove.push(obj as FabricObject);
      }
    });
    
    // Remove non-grid elements
    toRemove.forEach(obj => canvas.remove(obj));
    
    // Recreate grid if needed
    if (toKeep.length === 0) {
      gridLayerRef.current = createGrid(canvas);
    }
    
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Failed to clear drawings:", error);
  }
};

/**
 * Handle switching between different drawing tools
 * @param {FabricCanvas} canvas - The fabric canvas instance
 * @param {DrawingTool} tool - The selected drawing tool
 */
export const setActiveTool = (
  canvas: FabricCanvas,
  tool: DrawingTool
): void => {
  if (!canvas) return;
  
  try {
    // Reset selection mode
    canvas.selection = tool === 'select';
    canvas.isDrawingMode = tool === 'draw';
    
    // Configure objects based on tool
    const objects = canvas.getObjects();
    objects.forEach(obj => {
      // Make objects selectable only in select mode
      (obj as FabricObject).selectable = tool === 'select';
      (obj as FabricObject).evented = tool === 'select';
    });
    
    logger.debug(`Tool set to: ${tool}`);
    
    // Ensure canvas is refreshed
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Failed to set active tool:", error);
  }
};

/**
 * Create a line between two points
 * @param {Point} start - Starting point
 * @param {Point} end - Ending point
 * @param {Partial<FabricObjectProps>} options - Line options
 * @returns {Line} Created line object
 */
export const createLine = (
  start: Point,
  end: Point,
  options: Partial<FabricObjectProps> = {}
): Line => {
  // Ensure points are snapped to grid
  const snappedStart = snapToGrid(start);
  const snappedEnd = snapToGrid(end);
  
  // Create the line
  const line = new Line(
    [snappedStart.x, snappedStart.y, snappedEnd.x, snappedEnd.y],
    {
      strokeWidth: 2,
      stroke: '#000000',
      selectable: true,
      ...options,
      data: { 
        type: 'wall',
        ...(options.data || {})
      }
    }
  );
  
  // Apply correct layer ordering
  setObjectLayer(line, ObjectType.WALL);
  
  return line;
};

/**
 * Create a point marker at a specific location
 * @param {Point} point - Point location 
 * @param {Partial<FabricObjectProps>} options - Circle options
 * @returns {Circle} Created circle object
 */
export const createPointMarker = (
  point: Point, 
  options: Partial<FabricObjectProps> = {}
): Circle => {
  // Ensure point is snapped to grid
  const snappedPoint = snapToGrid(point);
  
  // Create a small circle at the point
  const circle = new Circle({
    left: snappedPoint.x - 2,
    top: snappedPoint.y - 2,
    radius: 2,
    fill: '#ff0000',
    stroke: '#ff0000',
    strokeWidth: 1,
    selectable: false,
    ...options,
    data: {
      type: 'marker',
      ...(options.data || {})
    }
  });
  
  return circle;
};

/**
 * Add a measurement label for a line
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {Line} line - The line to measure
 * @param {string} text - Text to display
 * @param {MeasurementTextOptions} options - Text display options
 */
export const addMeasurementToLine = (
  canvas: FabricCanvas,
  line: Line,
  text: string,
  options: MeasurementTextOptions = {}
): void => {
  if (!canvas || !line) return;
  
  try {
    // Use coords instead of points
    const coords = line.coords || line.calcLinePoints?.() || {x1: 0, y1: 0, x2: 0, y2: 0};
    
    // Calculate midpoint position for the label
    const x1 = coords.x1 || 0;
    const y1 = coords.y1 || 0;
    const x2 = coords.x2 || 0;
    const y2 = coords.y2 || 0;
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Default options
    const {
      fontSize = 12,
      fontFamily = 'Arial',
      fill = '#333',
      backgroundColor = 'rgba(255,255,255,0.8)',
      padding = 2
    } = options;
    
    // Create text object
    const textObj = new Text(text, {
      left: midX,
      top: midY,
      fontSize,
      fontFamily,
      fill,
      backgroundColor,
      padding,
      selectable: false,
      data: { type: 'measurement' }
    });
    
    // Center the text at the midpoint
    textObj.set({
      left: midX - (textObj.width || 0) / 2,
      top: midY - (textObj.height || 0) / 2
    });
    
    // Set proper layer ordering
    setObjectLayer(textObj, ObjectType.MEASUREMENT);
    
    // Add to canvas
    canvas.add(textObj);
    canvas.requestRenderAll();
  } catch (error) {
    logger.error("Failed to add measurement to line:", error);
  }
};

/**
 * Clear all objects of a specific type from the canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {string} dataType - The data type to clear
 */
export const clearObjectsByType = (
  canvas: FabricCanvas, 
  dataType: string
): void => {
  if (!canvas) return;
  
  try {
    const objects = canvas.getObjects();
    const toRemove: FabricObject[] = [];
    
    // Find all objects matching the data type
    objects.forEach(obj => {
      const data = (obj as FabricObject).get('data');
      if (data && data.type === dataType) {
        toRemove.push(obj as FabricObject);
      }
    });
    
    // Remove all identified objects
    toRemove.forEach(obj => {
      canvas.remove(obj);
    });
    
    if (toRemove.length > 0) {
      logger.debug(`Cleared ${toRemove.length} objects of type: ${dataType}`);
      canvas.requestRenderAll();
    }
  } catch (error) {
    logger.error(`Failed to clear objects of type ${dataType}:`, error);
  }
};
