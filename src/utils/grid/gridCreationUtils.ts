
/**
 * Grid Creation Utilities
 * Utilities for creating and managing grid objects
 * @module utils/grid/gridCreationUtils
 */
import { Canvas as FabricCanvas } from 'fabric';
import { GridLine, GridOptions } from './gridTypes';

/**
 * Create a grid of lines on the canvas
 * @param canvas The canvas to create the grid on
 * @param options Grid options
 * @returns Array of created grid lines
 */
export function createGrid(canvas: FabricCanvas, options: GridOptions = {}): GridLine[] {
  const {
    spacing = 50,
    color = '#e0e0e0',
    opacity = 0.5,
    strokeWidth = 1,
    visible = true
  } = options;
  
  const gridLines: GridLine[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      // Create custom properties object
      const lineProps = {
        stroke: color,
        strokeWidth,
        opacity,
        selectable: false,
        evented: false,
        visible,
        gridObject: true,
        gridType: 'horizontal'
      };

      // Create the line with proper typing
      const line = new window.fabric.Line([0, y, width, y], lineProps);
      
      canvas.add(line);
      gridLines.push(line as GridLine);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += spacing) {
      // Create custom properties object
      const lineProps = {
        stroke: color,
        strokeWidth,
        opacity,
        selectable: false,
        evented: false,
        visible,
        gridObject: true,
        gridType: 'vertical'
      };

      // Create the line with proper typing
      const line = new window.fabric.Line([x, 0, x, height], lineProps);
      
      canvas.add(line);
      gridLines.push(line as GridLine);
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
 * Remove grid lines from canvas
 * @param canvas The canvas containing the grid
 * @param gridLines Array of grid lines to remove
 */
export function removeGrid(canvas: FabricCanvas, gridLines: GridLine[]): void {
  try {
    gridLines.forEach(line => {
      canvas.remove(line);
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error('Error removing grid:', error);
  }
}

/**
 * Update grid visibility
 * @param canvas The canvas containing the grid
 * @param gridLines Array of grid lines to update
 * @param visible Whether the grid should be visible
 */
export function updateGridVisibility(canvas: FabricCanvas, gridLines: GridLine[], visible: boolean): void {
  try {
    gridLines.forEach(line => {
      line.set('visible', visible);
    });
    
    canvas.requestRenderAll();
  } catch (error) {
    console.error('Error updating grid visibility:', error);
  }
}

/**
 * Update grid dimensions when canvas size changes
 * @param canvas The canvas containing the grid
 * @param gridLines Array of grid lines to update
 * @param options Grid options
 */
export function updateGridDimensions(canvas: FabricCanvas, gridLines: GridLine[], options: GridOptions = {}): void {
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  try {
    // Remove existing grid
    removeGrid(canvas, gridLines);
    
    // Create new grid with updated dimensions
    createGrid(canvas, options);
  } catch (error) {
    console.error('Error updating grid dimensions:', error);
  }
}
