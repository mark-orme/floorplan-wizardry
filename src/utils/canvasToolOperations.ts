
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
  IObjectOptions 
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
 * @param {Partial<IObjectOptions>} options - Line options
 * @returns {Line} Created line object
 */
export const createLine = (
  start: Point,
  end: Point,
  options: Partial<IObjectOptions> = {}
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
 * @param {Partial<IObjectOptions>} options - Circle options
 * @returns {Circle} Created circle object
 */
export const createPointMarker = (
  point: Point, 
  options: Partial<IObjectOptions> = {}
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
    const points = line.points || [];
    if (points.length < 2) return;
    
    // Calculate midpoint position for the label
    const x1 = points[0].x || 0;
    const y1 = points[0].y || 0;
    const x2 = points[1].x || 0;
    const y2 = points[1].y || 0;
    
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
    const textObj = new fabric.Text(text, {
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
