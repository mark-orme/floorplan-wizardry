
/**
 * Grid creation utilities for canvas
 */
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';

/**
 * Grid options interface
 */
export interface GridOptions {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  showMajorLines?: boolean;
  majorInterval?: number;
  majorStroke?: string;
  majorStrokeWidth?: number;
}

/**
 * Create a grid on the canvas
 * @param canvas Fabric canvas instance
 * @param options Grid configuration options
 * @returns Array of created grid objects
 */
export function createGrid(canvas: FabricCanvas, options: GridOptions = {}): FabricObject[] {
  if (!canvas || !canvas.width || !canvas.height) {
    console.warn('Cannot create grid: Canvas has invalid dimensions');
    return [];
  }
  
  // Default options
  const size = options.size || 20;
  const stroke = options.stroke || '#e0e0e0';
  const strokeWidth = options.strokeWidth || 0.5;
  const showMajorLines = options.showMajorLines !== false;
  const majorInterval = options.majorInterval || 5;
  const majorStroke = options.majorStroke || '#c0c0c0';
  const majorStrokeWidth = options.majorStrokeWidth || 1;
  
  // Remove any existing grid
  const existingGrid = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );
  
  existingGrid.forEach(obj => {
    canvas.remove(obj);
  });
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.width;
  const height = canvas.height;
  
  // Create horizontal grid lines
  for (let i = 0; i <= height; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([0, i, width, i], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectType: 'grid'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back
    canvas.sendObjectToBack(line);
  }
  
  // Create vertical grid lines
  for (let i = 0; i <= width; i += size) {
    const isMajor = showMajorLines && i % (size * majorInterval) === 0;
    
    const line = new Line([i, 0, i, height], {
      stroke: isMajor ? majorStroke : stroke,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      selectable: false,
      evented: false,
      objectType: 'grid'
    } as any);
    
    canvas.add(line);
    gridObjects.push(line);
    
    // Send to back
    canvas.sendObjectToBack(line);
  }
  
  return gridObjects;
}
