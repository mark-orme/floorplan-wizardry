
/**
 * Grid creation utilities
 * @module gridCreators
 */
import { Canvas, Object as FabricObject, Line, Text } from "fabric";
import { GRID_SPACING } from "@/constants/numerics";

/**
 * Create horizontal grid lines
 * @param canvas - Canvas to add lines to
 * @param width - Width of canvas
 * @param height - Height of canvas
 * @param spacing - Spacing between lines
 * @param options - Line styling options
 * @returns Array of created lines
 */
export const createHorizontalGridLines = (
  canvas: Canvas,
  width: number,
  height: number,
  spacing: number,
  options: {
    color: string;
    width: number;
    selectable: boolean;
  }
): FabricObject[] => {
  const lines: FabricObject[] = [];
  
  for (let y = 0; y <= height; y += spacing) {
    const line = new Line([0, y, width, y], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    lines.push(line);
  }
  
  return lines;
};

/**
 * Create vertical grid lines
 * @param canvas - Canvas to add lines to
 * @param width - Width of canvas
 * @param height - Height of canvas
 * @param spacing - Spacing between lines
 * @param options - Line styling options
 * @returns Array of created lines
 */
export const createVerticalGridLines = (
  canvas: Canvas,
  width: number,
  height: number,
  spacing: number,
  options: {
    color: string;
    width: number;
    selectable: boolean;
  }
): FabricObject[] => {
  const lines: FabricObject[] = [];
  
  for (let x = 0; x <= width; x += spacing) {
    const line = new Line([x, 0, x, height], {
      stroke: options.color,
      strokeWidth: options.width,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    lines.push(line);
  }
  
  return lines;
};

/**
 * Create grid markers
 * @param canvas - Canvas to add markers to
 * @param width - Width of canvas
 * @param height - Height of canvas
 * @param spacing - Spacing between markers
 * @param options - Text styling options
 * @returns Array of created text markers
 */
export const createGridMarkers = (
  canvas: Canvas,
  width: number,
  height: number,
  spacing: number,
  options: {
    color: string;
    selectable: boolean;
  }
): FabricObject[] => {
  const markers: FabricObject[] = [];
  
  // Skip origin point (0,0)
  for (let x = spacing; x < width; x += spacing) {
    const text = new Text(String(x), {
      left: x,
      top: 5,
      fontSize: 10,
      fill: options.color,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(text);
    markers.push(text);
  }
  
  for (let y = spacing; y < height; y += spacing) {
    const text = new Text(String(y), {
      left: 5,
      top: y,
      fontSize: 10,
      fill: options.color,
      selectable: options.selectable,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(text);
    markers.push(text);
  }
  
  return markers;
};

/**
 * Create small grid
 * @param canvas - Canvas to add grid to
 * @param width - Width of canvas
 * @param height - Height of canvas
 * @returns Array of created grid objects
 */
export const createSmallGrid = (
  canvas: Canvas,
  width: number,
  height: number
): FabricObject[] => {
  const smallGridLines: FabricObject[] = [];
  
  // Small grid specs
  const spacing = GRID_SPACING.SMALL;
  const options = {
    color: '#e0e0e0',
    width: 0.5,
    selectable: false
  };
  
  // Create horizontal lines
  const horizontalLines = createHorizontalGridLines(
    canvas,
    width,
    height,
    spacing,
    options
  );
  
  // Create vertical lines
  const verticalLines = createVerticalGridLines(
    canvas,
    width,
    height,
    spacing,
    options
  );
  
  // Combine all small grid objects
  smallGridLines.push(...horizontalLines, ...verticalLines);
  
  return smallGridLines;
};

/**
 * Create large grid
 * @param canvas - Canvas to add grid to
 * @param width - Width of canvas
 * @param height - Height of canvas
 * @returns Array of created grid objects
 */
export const createLargeGrid = (
  canvas: Canvas,
  width: number,
  height: number
): FabricObject[] => {
  const largeGridLines: FabricObject[] = [];
  
  // Large grid specs
  const spacing = GRID_SPACING.LARGE;
  const options = {
    color: '#c0c0c0',
    width: 1,
    selectable: false
  };
  
  // Create horizontal lines
  const horizontalLines = createHorizontalGridLines(
    canvas,
    width,
    height,
    spacing,
    options
  );
  
  // Create vertical lines
  const verticalLines = createVerticalGridLines(
    canvas,
    width,
    height,
    spacing,
    options
  );
  
  // Combine all large grid objects
  largeGridLines.push(...horizontalLines, ...verticalLines);
  
  return largeGridLines;
};
