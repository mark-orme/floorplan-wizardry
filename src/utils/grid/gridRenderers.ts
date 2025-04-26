
/**
 * Grid Renderers
 * Provides functions for creating and rendering grid lines
 * @module utils/grid/gridRenderers
 */
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { GridLine, GridOptions, GridObject } from './gridTypes';

/**
 * Creates a grid on the canvas
 * @param canvas Fabric.js canvas
 * @param options Grid options
 * @returns Array of grid objects created
 */
export function createGrid(
  canvas: Canvas, 
  options: GridOptions = {}
): GridLine[] {
  if (!canvas) {
    console.warn('Cannot create grid: Canvas is null');
    return [];
  }

  const {
    spacing = 50,
    color = '#e0e0e0',
    opacity = 0.5,
    strokeWidth = 1,
    visible = true
  } = options;

  const gridLines: GridLine[] = [];
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();
  
  try {
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += spacing) {
      const line = new window.fabric.Line([x, 0, x, canvasHeight], {
        stroke: color,
        strokeWidth,
        opacity,
        selectable: false,
        evented: false,
        visible,
        gridObject: true,
        gridType: 'vertical'
      }) as GridLine;
      
      canvas.add(line);
      gridLines.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += spacing) {
      const line = new window.fabric.Line([0, y, canvasWidth, y], {
        stroke: color,
        strokeWidth,
        opacity,
        selectable: false,
        evented: false,
        visible,
        gridObject: true,
        gridType: 'horizontal'
      }) as GridLine;
      
      canvas.add(line);
      gridLines.push(line);
    }
    
    // Ensure grid is behind other objects
    gridLines.forEach(line => {
      canvas.sendToBack(line);
    });
    
    canvas.requestRenderAll();
    
    return gridLines;
  } catch (error) {
    console.error('Error creating grid:', error);
    return [];
  }
}

/**
 * Update grid visibility
 * @param canvas Fabric.js canvas
 * @param gridLines Grid lines to update
 * @param visible Whether grid should be visible
 */
export function updateGridVisibility(
  canvas: Canvas, 
  gridLines: GridLine[], 
  visible: boolean
): void {
  if (!canvas) {
    console.warn('Cannot update grid visibility: Canvas is null');
    return;
  }
  
  gridLines.forEach(line => {
    line.set('visible', visible);
  });
  
  canvas.requestRenderAll();
}

/**
 * Remove grid lines from canvas
 * @param canvas Fabric.js canvas
 * @param gridLines Grid lines to remove
 */
export function removeGrid(
  canvas: Canvas, 
  gridLines: GridLine[]
): void {
  if (!canvas) {
    console.warn('Cannot remove grid: Canvas is null');
    return;
  }
  
  gridLines.forEach(line => {
    canvas.remove(line);
  });
  
  canvas.requestRenderAll();
}

/**
 * Check if an object is a grid object
 * @param obj Object to check
 * @returns Whether object is a grid object
 */
export function isGridObject(obj: FabricObject): boolean {
  return obj && (
    (obj as GridObject).gridObject === true || 
    (obj as { objectType?: string }).objectType === 'grid' ||
    (obj as { isGrid?: boolean }).isGrid === true
  );
}
