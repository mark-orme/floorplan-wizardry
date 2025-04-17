
import { Canvas as FabricCanvas, Line } from 'fabric';

interface GridOptions {
  gridSpacing: number;
  majorGridInterval: number;
  gridColor: string;
  majorGridColor: string;
  gridSize: number;
}

/**
 * Creates a grid on the canvas
 * @param canvas - Fabric canvas instance
 * @param options - Grid configuration options
 * @returns Array of created grid objects
 */
export const createGrid = (
  canvas: FabricCanvas, 
  options: GridOptions = {
    gridSpacing: 20,
    majorGridInterval: 5,
    gridColor: '#e5e5e5',
    majorGridColor: '#c0c0c0',
    gridSize: 5000
  }
): any[] => {
  if (!canvas) {
    console.error('Canvas is null or undefined');
    return [];
  }

  try {
    // Clear any existing grid
    const existingGridObjects = canvas.getObjects().filter(obj => (obj as any).isGrid);
    existingGridObjects.forEach(obj => canvas.remove(obj));
    
    const gridObjects: any[] = [];
    const { 
      gridSpacing, 
      majorGridInterval, 
      gridColor, 
      majorGridColor,
      gridSize
    } = options;
    
    // Determine canvas dimensions
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    // Calculate grid dimensions (make it large enough to handle panning)
    const gridWidth = gridSize;
    const gridHeight = gridSize;
    
    // Calculate grid origin at the center of the canvas
    const originX = width / 2 - gridWidth / 2;
    const originY = height / 2 - gridHeight / 2;
    
    // Flag to track whether grid was created successfully
    let gridCreated = false;
    
    // Create vertical grid lines
    for (let i = 0; i <= gridWidth; i += gridSpacing) {
      const isMajor = i % (gridSpacing * majorGridInterval) === 0;
      const line = new Line([i + originX, originY, i + originX, originY + gridHeight], {
        stroke: isMajor ? majorGridColor : gridColor,
        selectable: false,
        strokeWidth: isMajor ? 1 : 0.5,
        evented: false,
        objectCaching: false
      });
      // Mark as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      canvas.add(line);
      gridObjects.push(line);
      
      // Set flag to true once we've created at least one line
      gridCreated = true;
    }
    
    // Create horizontal grid lines
    for (let i = 0; i <= gridHeight; i += gridSpacing) {
      const isMajor = i % (gridSpacing * majorGridInterval) === 0;
      const line = new Line([originX, i + originY, originX + gridWidth, i + originY], {
        stroke: isMajor ? majorGridColor : gridColor,
        selectable: false,
        strokeWidth: isMajor ? 1 : 0.5,
        evented: false,
        objectCaching: false
      });
      // Mark as grid object
      (line as any).isGrid = true;
      (line as any).objectType = 'grid';
      
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Send all grid objects to the back
    gridObjects.forEach(obj => canvas.sendToBack(obj));
    
    // Force render the canvas
    canvas.requestRenderAll();
    
    if (!gridCreated) {
      console.warn('Grid appears to have been created but no lines were added');
    } else {
      console.log(`Grid created successfully with ${gridObjects.length} lines`);
    }
    
    return gridObjects;
  } catch (error) {
    console.error('Error creating grid:', error);
    return [];
  }
};
