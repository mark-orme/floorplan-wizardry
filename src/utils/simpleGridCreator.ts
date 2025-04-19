
import { Canvas as FabricCanvas, Line } from 'fabric';

/**
 * Creates a simple grid on the canvas with better compatibility
 * @param canvas The fabric canvas instance
 * @param gridSize Size of grid squares (optional, defaults to 20px)
 * @returns Array of created grid objects
 */
export const createSimpleGrid = (canvas: FabricCanvas, gridSize = 20) => {
  if (!canvas) return [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const gridColor = isMobile ? 'rgba(180, 180, 180, 0.8)' : 'rgba(200, 200, 200, 0.5)';
    const strokeWidth = isMobile ? 1.5 : 1;
    
    console.log(`Creating simple grid: ${width}x${height}, gridSize: ${gridSize}px`);
    
    // Remove any existing grid
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    existingGrid.forEach(obj => canvas.remove(obj));
    
    const gridObjects: any[] = [];
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: gridColor,
        strokeWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: gridColor,
        strokeWidth,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Make sure grid is at the back
    gridObjects.forEach(obj => {
      if (canvas.sendToBack) {
        canvas.sendToBack(obj);
      } else if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    canvas.renderAll();
    return gridObjects;
  } catch (error) {
    console.error('Error creating simple grid:', error);
    return [];
  }
};

/**
 * Ensures grid is visible after canvas operations
 * @param canvas Fabric canvas instance
 * @returns True if grid was found and made visible
 */
export const ensureGridVisible = (canvas: FabricCanvas): boolean => {
  if (!canvas) return false;
  
  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).isGrid === true || (obj as any).objectType === 'grid'
  );
  
  if (gridObjects.length === 0) {
    console.log('No grid found, creating new grid');
    createSimpleGrid(canvas);
    return true;
  }
  
  let visibilityFixed = false;
  gridObjects.forEach(obj => {
    if (!obj.visible) {
      obj.set('visible', true);
      visibilityFixed = true;
    }
  });
  
  if (visibilityFixed) {
    canvas.renderAll();
  }
  
  return true;
};

/**
 * Creates basic emergency grid as a fallback
 * @param canvas Fabric canvas instance
 * @returns Array of created grid objects
 */
export const createEmergencyGrid = (canvas: FabricCanvas) => {
  if (!canvas) return [];
  
  try {
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    
    // Use a larger grid size for emergency mode (better performance)
    const gridSize = 40;
    const gridColor = 'rgba(200, 200, 200, 0.8)'; // More visible
    
    console.log(`Creating emergency grid: ${width}x${height}, gridSize: ${gridSize}px`);
    
    const gridObjects: any[] = [];
    
    // Create only major grid lines for better performance
    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: gridColor,
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: gridColor,
        strokeWidth: 1.5,
        selectable: false,
        evented: false,
        objectType: 'grid',
        isGrid: true
      });
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Make sure grid is at the back
    gridObjects.forEach(obj => {
      if (canvas.sendToBack) {
        canvas.sendToBack(obj);
      } else if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(obj);
      }
    });
    
    canvas.renderAll();
    return gridObjects;
  } catch (error) {
    console.error('Error creating emergency grid:', error);
    return [];
  }
};
