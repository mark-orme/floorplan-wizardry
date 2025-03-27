
/**
 * Grid renderer utility
 * Handles rendering grid lines on the canvas
 * @module utils/gridRenderer
 */
import { Canvas as FabricCanvas, Line, Text, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { GridRenderResult, GridLineOptions } from '@/utils/grid/typeUtils';

/**
 * Constants for grid rendering
 */
const GRID_RENDER_CONSTANTS = {
  /** Text size for grid markers */
  MARKER_TEXT_SIZE: 10,
  
  /** Small grid opacity */
  SMALL_GRID_OPACITY: 0.4,
  
  /** Large grid opacity */
  LARGE_GRID_OPACITY: 0.6,
  
  /** Z-index for grid */
  GRID_Z_INDEX: -10,
  
  /** Default grid extension factor */
  EXTENSION_FACTOR: 1.5,
  
  /** Padding for grid markers */
  MARKER_PADDING: 5
};

/**
 * Props for rendering a grid
 */
interface RenderGridProps {
  /** Canvas to render on */
  canvas: FabricCanvas;
  /** Small grid size */
  smallGridSize?: number;
  /** Large grid size */
  largeGridSize?: number;
  /** Whether to include text markers */
  includeMarkers?: boolean;
  /** Color for small grid lines */
  smallGridColor?: string;
  /** Color for large grid lines */
  largeGridColor?: string;
}

/**
 * Render a grid on the canvas
 * 
 * @param props - Rendering properties
 * @returns Rendered grid objects
 */
export const renderGrid = ({
  canvas,
  smallGridSize = GRID_CONSTANTS.SMALL_GRID_SIZE,
  largeGridSize = GRID_CONSTANTS.LARGE_GRID_SIZE,
  includeMarkers = true,
  smallGridColor = GRID_CONSTANTS.SMALL_GRID_COLOR,
  largeGridColor = GRID_CONSTANTS.LARGE_GRID_COLOR
}: RenderGridProps): GridRenderResult => {
  if (!canvas) {
    throw new Error('Canvas is required for grid rendering');
  }
  
  // Get canvas dimensions
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Extension factor to draw grid beyond visible area
  const extendedWidth = width * GRID_RENDER_CONSTANTS.EXTENSION_FACTOR;
  const extendedHeight = height * GRID_RENDER_CONSTANTS.EXTENSION_FACTOR;
  const offsetX = (extendedWidth - width) / 2;
  const offsetY = (extendedHeight - height) / 2;
  
  // Grid objects arrays
  const smallGridLines: Line[] = [];
  const largeGridLines: Line[] = [];
  const markers: FabricObject[] = [];
  
  // Small grid options
  const smallGridOptions: GridLineOptions = {
    stroke: smallGridColor,
    strokeWidth: GRID_CONSTANTS.SMALL_GRID_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'grid-small',
    objectCaching: false,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.SMALL_GRID_OPACITY
  };
  
  // Large grid options
  const largeGridOptions: GridLineOptions = {
    stroke: largeGridColor,
    strokeWidth: GRID_CONSTANTS.LARGE_GRID_WIDTH,
    selectable: false,
    evented: false,
    objectType: 'grid-large',
    objectCaching: false,
    hoverCursor: 'default',
    opacity: GRID_RENDER_CONSTANTS.LARGE_GRID_OPACITY
  };
  
  // Draw vertical small grid lines
  for (let x = -offsetX; x <= width + offsetX; x += smallGridSize) {
    const line = new Line([x, -offsetY, x, height + offsetY], {
      ...smallGridOptions
    });
    smallGridLines.push(line);
    canvas.add(line);
    line.sendToBack();
  }
  
  // Draw horizontal small grid lines
  for (let y = -offsetY; y <= height + offsetY; y += smallGridSize) {
    const line = new Line([-offsetX, y, width + offsetX, y], {
      ...smallGridOptions
    });
    smallGridLines.push(line);
    canvas.add(line);
    line.sendToBack();
  }
  
  // Draw vertical large grid lines
  for (let x = -offsetX; x <= width + offsetX; x += largeGridSize) {
    const line = new Line([x, -offsetY, x, height + offsetY], {
      ...largeGridOptions
    });
    largeGridLines.push(line);
    canvas.add(line);
    line.sendToBack();
    
    // Add text markers if enabled
    if (includeMarkers) {
      const markerText = new Text(Math.round(x / GRID_CONSTANTS.PIXELS_PER_METER).toString(), {
        left: x,
        top: GRID_RENDER_CONSTANTS.MARKER_PADDING,
        fontSize: GRID_RENDER_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false
      });
      markers.push(markerText);
      canvas.add(markerText);
    }
  }
  
  // Draw horizontal large grid lines
  for (let y = -offsetY; y <= height + offsetY; y += largeGridSize) {
    const line = new Line([-offsetX, y, width + offsetX, y], {
      ...largeGridOptions
    });
    largeGridLines.push(line);
    canvas.add(line);
    line.sendToBack();
    
    // Add text markers if enabled
    if (includeMarkers) {
      const markerText = new Text(Math.round(y / GRID_CONSTANTS.PIXELS_PER_METER).toString(), {
        left: GRID_RENDER_CONSTANTS.MARKER_PADDING,
        top: y,
        fontSize: GRID_RENDER_CONSTANTS.MARKER_TEXT_SIZE,
        fill: GRID_CONSTANTS.MARKER_COLOR,
        selectable: false,
        evented: false
      });
      markers.push(markerText);
      canvas.add(markerText);
    }
  }
  
  // All grid objects combined
  const gridObjects = [...smallGridLines, ...largeGridLines, ...markers];
  
  // Set z-index for all grid objects
  gridObjects.forEach(obj => {
    obj.set('z-index', GRID_RENDER_CONSTANTS.GRID_Z_INDEX);
    canvas.sendToBack(obj);
  });
  
  return {
    gridObjects,
    markers,
    gridLines: [...smallGridLines, ...largeGridLines],
    smallGridLines,
    largeGridLines
  };
};

/**
 * Removes grid objects from canvas
 * 
 * @param canvas - Canvas with grid
 * @param gridObjects - Grid objects to remove
 */
export const removeGrid = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    if (canvas.contains(obj)) {
      canvas.remove(obj);
    }
  });
  
  canvas.renderAll();
};

/**
 * Hides grid objects without removing them
 * 
 * @param gridObjects - Grid objects to hide
 */
export const hideGrid = (gridObjects: FabricObject[]): void => {
  gridObjects.forEach(obj => {
    obj.set('visible', false);
  });
};

/**
 * Shows grid objects
 * 
 * @param gridObjects - Grid objects to show
 */
export const showGrid = (gridObjects: FabricObject[]): void => {
  gridObjects.forEach(obj => {
    obj.set('visible', true);
  });
};
