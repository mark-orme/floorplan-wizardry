
/**
 * Grid rendering utilities
 */
import { Canvas, Line } from 'fabric';

interface GridOptions {
  size: number;
  color: string;
  opacity: number;
  visible: boolean;
}

/**
 * Validate grid options
 * @param options Grid options to validate
 * @returns Validated grid options
 */
export function validateGrid(options: Partial<GridOptions> = {}): GridOptions {
  return {
    size: options.size !== undefined ? Math.max(5, options.size) : 20,
    color: options.color || '#cccccc',
    opacity: options.opacity !== undefined ? Math.max(0, Math.min(1, options.opacity)) : 0.5,
    visible: options.visible !== undefined ? options.visible : true
  };
}

/**
 * Create grid lines for the canvas
 * @param canvas The fabric canvas
 * @param options Grid options
 * @returns Array of grid line objects
 */
export function createGridLines(
  canvas: Canvas | null, 
  options: Partial<GridOptions> = {}
): Line[] {
  if (!canvas) return [];
  
  const gridOptions = validateGrid(options);
  if (!gridOptions.visible) return [];
  
  const lines: Line[] = [];
  const width = canvas.getWidth ? canvas.getWidth() : 1000;
  const height = canvas.getHeight ? canvas.getHeight() : 1000;
  const size = gridOptions.size;
  
  // Create vertical lines
  for (let x = 0; x <= width; x += size) {
    lines.push(
      new Line([x, 0, x, height], {
        stroke: gridOptions.color,
        strokeWidth: 1,
        opacity: gridOptions.opacity,
        selectable: false,
        evented: false,
        strokeDashArray: [2, 2]
      })
    );
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += size) {
    lines.push(
      new Line([0, y, width, y], {
        stroke: gridOptions.color,
        strokeWidth: 1,
        opacity: gridOptions.opacity,
        selectable: false,
        evented: false,
        strokeDashArray: [2, 2]
      })
    );
  }
  
  return lines;
}

/**
 * Add grid lines to canvas
 * @param canvas The fabric canvas
 * @param options Grid options
 * @returns Array of added grid line objects
 */
export function addGridToCanvas(
  canvas: Canvas | null, 
  options: Partial<GridOptions> = {}
): Line[] {
  if (!canvas) return [];
  
  const lines = createGridLines(canvas, options);
  lines.forEach(line => canvas.add(line));
  canvas.renderAll();
  
  return lines;
}

/**
 * Remove grid lines from canvas
 * @param canvas The fabric canvas
 * @param gridLines Array of grid lines to remove
 */
export function removeGridFromCanvas(
  canvas: Canvas | null, 
  gridLines: Line[]
): void {
  if (!canvas) return;
  
  gridLines.forEach(line => canvas.remove(line));
  canvas.renderAll();
}
