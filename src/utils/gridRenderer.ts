import { GRID_COLORS } from '@/constants/gridConstants';
import type { Canvas as FabricCanvas } from 'fabric';
import type { FabricObject, FabricObjectProps, SerializedObjectProps, ObjectEvents } from 'fabric';

/**
 * Interface for grid rendering options
 */
interface GridRenderOptions {
  /** Color of small grid lines */
  smallGridColor?: string;
  /** Color of large grid lines */
  largeGridColor?: string;
  /** Width of small grid lines */
  smallGridWidth?: number;
  /** Width of large grid lines */
  largeGridWidth?: number;
  /** Color of grid text labels */
  textColor?: string;
  /** Font size for grid labels */
  fontSize?: number;
  /** Font family for grid labels */
  fontFamily?: string;
  /** Enable grid labels */
  showLabels?: boolean;
  /** Opacity of grid elements */
  opacity?: number;
}

/**
 * Default grid render options
 */
const DEFAULT_GRID_OPTIONS: GridRenderOptions = {
  smallGridColor: GRID_COLORS.SMALL_GRID_COLOR,
  largeGridColor: GRID_COLORS.LARGE_GRID_COLOR,
  smallGridWidth: 0.5,
  largeGridWidth: 1,
  textColor: GRID_COLORS.LABEL_COLOR,
  fontSize: 10,
  fontFamily: 'Arial',
  showLabels: true,
  opacity: 0.5
};

/**
 * Render a grid on the canvas with specified options
 * @param {FabricCanvas} canvas - The fabric canvas to render on
 * @param {Object} options - Grid rendering options
 * @returns {Array} Array of rendered grid objects
 */
export const renderGrid = (
  canvas: FabricCanvas,
  options: GridRenderOptions = DEFAULT_GRID_OPTIONS
): FabricObject[] => {
  if (!canvas) {
    console.error('Cannot render grid: Canvas is null');
    return [];
  }
  
  const mergedOptions = { ...DEFAULT_GRID_OPTIONS, ...options };
  const gridObjects: FabricObject[] = [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Don't render if canvas dimensions are invalid
    if (width <= 0 || height <= 0) {
      console.warn('Cannot render grid: Invalid canvas dimensions');
      return [];
    }
    
    // Create grid lines
    const smallGridSize = 20;
    const largeGridSize = 100;
    
    // Render small grid lines
    for (let i = 0; i < width; i += smallGridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: mergedOptions.smallGridColor,
        strokeWidth: mergedOptions.smallGridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i < height; i += smallGridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: mergedOptions.smallGridColor,
        strokeWidth: mergedOptions.smallGridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Render large grid lines
    for (let i = 0; i < width; i += largeGridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: mergedOptions.largeGridColor,
        strokeWidth: mergedOptions.largeGridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    for (let i = 0; i < height; i += largeGridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: mergedOptions.largeGridColor,
        strokeWidth: mergedOptions.largeGridWidth,
        selectable: false,
        evented: false,
        objectCaching: false
      });
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Add grid labels if enabled
    if (mergedOptions.showLabels) {
      // Add horizontal labels
      for (let i = 0; i < width; i += largeGridSize) {
        if (i === 0) continue; // Skip origin
        
        const text = new fabric.Text(`${i}`, {
          left: i,
          top: 5,
          fontSize: mergedOptions.fontSize,
          fontFamily: mergedOptions.fontFamily,
          fill: mergedOptions.textColor,
          selectable: false,
          evented: false,
          objectCaching: true
        });
        canvas.add(text);
        gridObjects.push(text);
      }
      
      // Add vertical labels
      for (let i = 0; i < height; i += largeGridSize) {
        if (i === 0) continue; // Skip origin
        
        const text = new fabric.Text(`${i}`, {
          left: 5,
          top: i,
          fontSize: mergedOptions.fontSize,
          fontFamily: mergedOptions.fontFamily,
          fill: mergedOptions.textColor,
          selectable: false,
          evented: false,
          objectCaching: true
        });
        canvas.add(text);
        gridObjects.push(text);
      }
    }
    
    // Check if any objects were created
    const removeAllGridObjects = () => {
      gridObjects.forEach((obj: FabricObject) => {
        canvas.remove(obj);
      });
    };
    
    // Store grid removal function on the canvas for easy cleanup
    if (typeof canvas.removeGrid !== 'function') {
      canvas.removeGrid = removeAllGridObjects;
    }
    
    return gridObjects;
  } catch (error) {
    console.error('Error rendering grid:', error);
    return [];
  }
};

/**
 * Remove all grid objects from the canvas
 * @param {FabricCanvas} canvas - The fabric canvas
 * @param {Array} gridObjects - Array of grid objects to remove
 * @returns {void}
 */
export const removeGrid = (
  canvas: FabricCanvas,
  gridObjects: FabricObject[]
): void => {
  if (!canvas) return;
  
  try {
    // Use canvas's removeGrid method if available
    if (typeof canvas.removeGrid === 'function') {
      canvas.removeGrid();
      return;
    }
    
    // Otherwise, remove each grid object individually
    gridObjects.forEach((obj: FabricObject) => {
      if (obj && canvas.contains(obj)) {
        canvas.remove(obj);
      }
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error('Error removing grid:', error);
  }
};

// Extend fabric.Canvas type to include our grid removal function
declare module 'fabric' {
  interface Canvas {
    removeGrid?: () => void;
  }
}
