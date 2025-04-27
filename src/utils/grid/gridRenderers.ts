
import { Canvas as FabricCanvas, Line } from 'fabric';
import { GridOptions } from './gridTypes';

/**
 * Create a simple grid of lines
 * @param canvas The canvas to create the grid on
 * @param options Grid options
 * @returns Array of created grid lines
 */
export function createGrid(canvas: FabricCanvas, options: GridOptions = {}) {
  const {
    spacing = 50,
    color = '#e0e0e0',
    opacity = 0.5,
    strokeWidth = 1,
    visible = true
  } = options;
  
  const gridLines = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const line = new window.fabric.Line([0, y, width, y], {
      stroke: color,
      strokeWidth,
      opacity,
      selectable: false,
      evented: false,
      visible,
      gridObject: true,
      gridType: 'horizontal'
    });
    
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const line = new window.fabric.Line([x, 0, x, height], {
      stroke: color,
      strokeWidth,
      opacity,
      selectable: false,
      evented: false,
      visible,
      gridObject: true,
      gridType: 'vertical'
    });
    
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Ensure grid is behind other objects
  gridLines.forEach(line => {
    canvas.sendToBack(line);
  });
  
  canvas.requestRenderAll();
  
  return gridLines;
}

/**
 * Create a complete grid with major and minor lines
 * @param canvas The canvas to create the grid on
 * @param options Grid options
 * @returns Array of created grid lines
 */
export function createCompleteGrid(canvas: FabricCanvas, options: GridOptions = {}) {
  const {
    spacing = 50,
    color = '#e0e0e0',
    opacity = 0.5,
    majorSpacing = 5, // How many minor lines between major lines
    majorColor = '#c0c0c0',
    majorOpacity = 0.7,
    strokeWidth = 1,
    majorStrokeWidth = 2,
    visible = true
  } = options;
  
  const gridLines = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    const isMajorLine = (y / spacing) % majorSpacing === 0;
    const line = new window.fabric.Line([0, y, width, y], {
      stroke: isMajorLine ? majorColor : color,
      strokeWidth: isMajorLine ? majorStrokeWidth : strokeWidth,
      opacity: isMajorLine ? majorOpacity : opacity,
      selectable: false,
      evented: false,
      visible,
      gridObject: true,
      gridType: isMajorLine ? 'horizontalMajor' : 'horizontal'
    });
    
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Create vertical lines
  for (let x = 0; x <= width; x += spacing) {
    const isMajorLine = (x / spacing) % majorSpacing === 0;
    const line = new window.fabric.Line([x, 0, x, height], {
      stroke: isMajorLine ? majorColor : color,
      strokeWidth: isMajorLine ? majorStrokeWidth : strokeWidth,
      opacity: isMajorLine ? majorOpacity : opacity,
      selectable: false,
      evented: false,
      visible,
      gridObject: true,
      gridType: isMajorLine ? 'verticalMajor' : 'vertical'
    });
    
    canvas.add(line);
    gridLines.push(line);
  }
  
  // Ensure grid is behind other objects
  gridLines.forEach(line => {
    canvas.sendToBack(line);
  });
  
  canvas.requestRenderAll();
  
  return gridLines;
}

/**
 * Create a basic emergency grid when main grid fails
 * @param canvas The canvas to create the grid on
 * @returns Array of created grid lines
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas) {
  const gridLines = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const spacing = 100;
  
  // Create simplified grid with minimal properties
  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      const line = new window.fabric.Line([0, y, width, y], {
        stroke: '#dddddd',
        opacity: 0.3,
        selectable: false,
      });
      
      canvas.add(line);
      gridLines.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += spacing) {
      const line = new window.fabric.Line([x, 0, x, height], {
        stroke: '#dddddd',
        opacity: 0.3,
        selectable: false,
      });
      
      canvas.add(line);
      gridLines.push(line);
    }
    
    canvas.requestRenderAll();
  } catch (e) {
    console.error('Failed to create emergency grid:', e);
  }
  
  return gridLines;
}
