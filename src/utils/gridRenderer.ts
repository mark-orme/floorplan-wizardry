
/**
 * Grid rendering utilities
 * Provides functions for creating and managing grid elements
 * @module gridRenderer
 */
import { Canvas, Line, Text } from 'fabric';
import { GridLineOptions, GridRenderResult } from './grid/typeUtils';

/**
 * Constants for grid rendering
 */
const GRID_RENDER_CONSTANTS = {
  /** Default opacity for small grid lines */
  SMALL_GRID_OPACITY: 0.3,
  /** Default opacity for large grid lines */
  LARGE_GRID_OPACITY: 0.5,
  /** Default opacity for axis lines */
  AXIS_OPACITY: 0.7,
  /** Default stroke width for small grid lines */
  SMALL_GRID_STROKE_WIDTH: 0.5,
  /** Default stroke width for large grid lines */
  LARGE_GRID_STROKE_WIDTH: 1,
  /** Default stroke width for axis lines */
  AXIS_STROKE_WIDTH: 1.5,
  /** Default color for small grid lines */
  SMALL_GRID_COLOR: '#DDDDDD',
  /** Default color for large grid lines */
  LARGE_GRID_COLOR: '#AAAAAA',
  /** Default color for axis lines */
  AXIS_COLOR: '#888888',
  /** Default color for grid markers */
  MARKER_COLOR: '#666666',
  /** Default size for grid markers */
  MARKER_FONT_SIZE: 10
};

/**
 * Creates a grid line with specified options
 * 
 * @param {number[]} coords - Array of coordinates [x1, y1, x2, y2]
 * @param {GridLineOptions} options - Options for the line
 * @returns {Line} Fabric.js Line object
 */
export const createGridLine = (
  coords: [number, number, number, number],
  options: GridLineOptions
): Line => {
  const [x1, y1, x2, y2] = coords;
  
  const line = new Line([x1, y1, x2, y2], {
    stroke: options.stroke,
    strokeWidth: options.strokeWidth,
    selectable: options.selectable,
    evented: options.evented,
    objectType: options.objectType,
    objectCaching: options.objectCaching,
    hoverCursor: options.hoverCursor,
    opacity: options.opacity
  });
  
  // Try to set the line to the back
  // In newer Fabric.js versions, this might need to be called after the line is added to the canvas
  try {
    (line as any).sendToBack?.();
  } catch (err) {
    console.warn('Could not send grid line to back:', err);
  }
  
  return line;
};

/**
 * Creates a grid marker (text)
 * 
 * @param {string} text - Text content for the marker
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {Text} Fabric.js Text object
 */
export const createGridMarker = (text: string, x: number, y: number): Text => {
  return new Text(text, {
    left: x,
    top: y,
    fontSize: GRID_RENDER_CONSTANTS.MARKER_FONT_SIZE,
    fill: GRID_RENDER_CONSTANTS.MARKER_COLOR,
    selectable: false,
    evented: false,
    objectType: 'grid-marker',
    objectCaching: true
  });
};

/**
 * Renders the grid components on the canvas
 * 
 * @param {Canvas} canvas - Fabric.js canvas object
 * @param {object} options - Grid rendering options
 * @returns {GridRenderResult} Object containing the rendered grid elements
 */
export const renderGridComponents = (
  canvas: Canvas,
  options: {
    width: number;
    height: number;
    smallGridSize: number;
    largeGridSize: number;
    showMarkers?: boolean;
  }
): GridRenderResult => {
  const { width, height, smallGridSize, largeGridSize, showMarkers = true } = options;
  
  const smallGridLines: Line[] = [];
  const largeGridLines: Line[] = [];
  const markers: Text[] = [];
  const allGridObjects: (Line | Text)[] = [];
  
  // Common line options for small grid lines
  const smallGridOptions: GridLineOptions = {
    stroke: GRID_RENDER_CONSTANTS.SMALL_GRID_COLOR,
    strokeWidth: GRID_RENDER_CONSTANTS.SMALL_GRID_STROKE_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'grid-small',
    objectCaching: true,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.SMALL_GRID_OPACITY
  };
  
  // Common line options for large grid lines
  const largeGridOptions: GridLineOptions = {
    stroke: GRID_RENDER_CONSTANTS.LARGE_GRID_COLOR,
    strokeWidth: GRID_RENDER_CONSTANTS.LARGE_GRID_STROKE_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'grid-large',
    objectCaching: true,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.LARGE_GRID_OPACITY
  };
  
  // Create small grid lines
  for (let i = 0; i <= width; i += smallGridSize) {
    const line = createGridLine([i, 0, i, height], smallGridOptions);
    smallGridLines.push(line);
    allGridObjects.push(line);
    canvas.add(line);
    try {
      (line as any).sendToBack?.();
    } catch (err) {
      console.warn('Could not send small grid line to back:', err);
    }
  }
  
  for (let i = 0; i <= height; i += smallGridSize) {
    const line = createGridLine([0, i, width, i], smallGridOptions);
    smallGridLines.push(line);
    allGridObjects.push(line);
    canvas.add(line);
    try {
      (line as any).sendToBack?.();
    } catch (err) {
      console.warn('Could not send small grid line to back:', err);
    }
  }
  
  // Create large grid lines
  for (let i = 0; i <= width; i += largeGridSize) {
    const line = createGridLine([i, 0, i, height], largeGridOptions);
    largeGridLines.push(line);
    allGridObjects.push(line);
    canvas.add(line);
    try {
      (line as any).sendToBack?.();
    } catch (err) {
      console.warn('Could not send large grid line to back:', err);
    }
  }
  
  for (let i = 0; i <= height; i += largeGridSize) {
    const line = createGridLine([0, i, width, i], largeGridOptions);
    largeGridLines.push(line);
    allGridObjects.push(line);
    canvas.add(line);
    try {
      (line as any).sendToBack?.();
    } catch (err) {
      console.warn('Could not send large grid line to back:', err);
    }
  }
  
  // Add markers if enabled
  if (showMarkers) {
    // Add horizontal markers
    for (let i = 0; i <= width; i += largeGridSize) {
      const marker = createGridMarker(`${i}`, i, height - 20);
      markers.push(marker);
      allGridObjects.push(marker);
      canvas.add(marker);
    }
    
    // Add vertical markers
    for (let i = 0; i <= height; i += largeGridSize) {
      const marker = createGridMarker(`${i}`, 10, i);
      markers.push(marker);
      allGridObjects.push(marker);
      canvas.add(marker);
    }
  }
  
  // Send all grid objects to the back
  try {
    allGridObjects.forEach(obj => (obj as any).sendToBack?.());
    (canvas as any).sendToBack?.();
  } catch (err) {
    console.warn('Could not send all grid objects to back:', err);
  }
  
  return {
    smallGridLines,
    largeGridLines,
    markers,
    gridObjects: allGridObjects
  };
};

/**
 * Arranges grid objects in the correct z-order
 * 
 * @param {Canvas} canvas - Fabric.js canvas object
 * @param {GridRenderResult} gridResult - Result from renderGridComponents
 * @returns {boolean} True if successful
 */
export const arrangeGridObjects = (
  canvas: Canvas,
  gridResult: GridRenderResult
): boolean => {
  try {
    // First render all small grid lines
    gridResult.smallGridLines.forEach(line => {
      try {
        (line as any).sendToBack?.();
      } catch (e) {
        // Ignore errors with sendToBack
        console.warn('Error sending small grid line to back:', e);
      }
    });
    
    // Then render all large grid lines
    gridResult.largeGridLines.forEach(line => {
      try {
        (line as any).sendToBack?.();
      } catch (e) {
        // Ignore errors with sendToBack
        console.warn('Error sending large grid line to back:', e);
      }
    });
    
    // Then render markers on top of grid lines
    gridResult.markers.forEach(marker => canvas.bringForward(marker));
    
    return true;
  } catch (error) {
    console.error('Error arranging grid objects:', error);
    return false;
  }
};
