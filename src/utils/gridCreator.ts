
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Creates a grid on the canvas
 * @param canvas The fabric canvas
 * @param width Canvas width
 * @param height Canvas height
 * @param gridSize Grid cell size (default: 20px)
 * @returns Array of grid line objects
 */
export const createGrid = (
  canvas: FabricCanvas, 
  width: number = 800, 
  height: number = 600, 
  gridSize: number = 20
) => {
  if (!canvas) {
    console.error('Canvas is not initialized');
    return [];
  }

  const gridColor = 'rgba(200, 200, 200, 0.5)';
  const gridObjects: any[] = [];
  
  try {
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      // Add metadata
      line.set('isGrid', true);
      line.set('objectType', 'grid');
      
      canvas.add(line);
      // Use moveTo instead of sendToBack
      canvas.moveTo(line, 0);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 1
      });
      
      // Add metadata
      line.set('isGrid', true);
      line.set('objectType', 'grid');
      
      canvas.add(line);
      // Use moveTo instead of sendToBack
      canvas.moveTo(line, 0);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
    return gridObjects;
  } catch (error) {
    console.error('Error creating grid:', error);
    return [];
  }
};
