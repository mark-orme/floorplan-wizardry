
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Creates a simple grid on the canvas
 */
export const createSimpleGrid = (
  canvas: FabricCanvas,
  gridSize: number = 20,
  color: string = '#e0e0e0',
  largeGridSize: number = 100,
  largeColor: string = '#c0c0c0'
): FabricObject[] => {
  const gridObjects: FabricObject[] = [];
  
  if (!canvas) {
    console.warn('Cannot create grid: Canvas is null');
    return gridObjects;
  }
  
  try {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Create vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % largeGridSize === 0;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? largeColor : color,
        strokeWidth: isLargeLine ? 1 : 0.5,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    // Create horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % largeGridSize === 0;
      const line = new fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? largeColor : color,
        strokeWidth: isLargeLine ? 1 : 0.5,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      canvas.sendToBack(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
  } catch (error) {
    console.error('Error creating grid:', error);
  }
  
  return gridObjects;
};

/**
 * Clears grid from canvas
 */
export const clearGrid = (canvas: FabricCanvas, gridObjects: FabricObject[]): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    canvas.remove(obj);
  });
  
  canvas.renderAll();
};

/**
 * Ensures grid is visible by setting opacity
 */
export const ensureGridVisible = (canvas: FabricCanvas, gridObjects: FabricObject[], visible: boolean = true): void => {
  if (!canvas) return;
  
  gridObjects.forEach(obj => {
    obj.set({ opacity: visible ? 1 : 0 });
  });
  
  canvas.renderAll();
};

/**
 * Validates if canvas is ready for grid creation
 */
export const isCanvasValidForGrid = (canvas: any): boolean => {
  return canvas && typeof canvas.getWidth === 'function' && typeof canvas.getHeight === 'function';
};
