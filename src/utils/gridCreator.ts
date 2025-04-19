
import { Canvas as FabricCanvas, Line } from 'fabric';
import { useIsMobile } from '@/hooks/use-mobile';

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

  // Determine if we're on mobile from window size if hook not available
  const isMobileDevice = typeof window !== 'undefined' &&
    (window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  
  // Set grid color based on device type
  const gridColor = isMobileDevice 
    ? 'rgba(180, 180, 180, 0.8)' // More visible on mobile
    : 'rgba(200, 200, 200, 0.5)';
  
  const gridObjects: any[] = [];
  
  try {
    // Clear any existing grid
    const existingGrid = canvas.getObjects().filter(obj => 
      (obj as any).isGrid === true || (obj as any).objectType === 'grid'
    );
    
    existingGrid.forEach(obj => {
      canvas.remove(obj);
    });
    
    console.log(`Creating grid with size ${gridSize}px on canvas ${width}x${height}`);
    
    // Create horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new Line([0, i, width, i], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: isMobileDevice ? 1.5 : 1,
        hoverCursor: 'default'
      });
      
      // Add metadata
      line.set('isGrid', true);
      line.set('objectType', 'grid');
      line.set('gridType', 'horizontal');
      
      canvas.add(line);
      // Use sendToBack instead of moveToBack (Fabric.js compatible)
      if (canvas.sendToBack) {
        canvas.sendToBack(line);
      } else if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new Line([i, 0, i, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: isMobileDevice ? 1.5 : 1,
        hoverCursor: 'default'
      });
      
      // Add metadata
      line.set('isGrid', true);
      line.set('objectType', 'grid');
      line.set('gridType', 'vertical');
      
      canvas.add(line);
      // Use sendToBack instead of moveToBack (Fabric.js compatible)
      if (canvas.sendToBack) {
        canvas.sendToBack(line);
      } else if (canvas.sendObjectToBack) {
        canvas.sendObjectToBack(line);
      }
      gridObjects.push(line);
    }
    
    // Force render
    canvas.renderAll();
    console.log(`Created grid with ${gridObjects.length} lines`);
    return gridObjects;
  } catch (error) {
    console.error('Error creating grid:', error);
    return [];
  }
};
