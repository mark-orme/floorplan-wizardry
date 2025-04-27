
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { GridOptions, GridLine } from './gridTypes';

/**
 * Creates a grid on the canvas
 */
export function createGrid(
  canvas: FabricCanvas,
  options: GridOptions = {}
): GridLine[] {
  const {
    spacing = 50,
    color = '#e0e0e0',
    opacity = 0.5,
    strokeWidth = 1,
    visible = true,
    majorSpacing = 100,
    majorColor = '#c0c0c0',
    majorOpacity = 0.7,
    majorStrokeWidth = 1.5,
  } = options;

  const gridObjects: GridLine[] = [];
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  // Create vertical lines
  for (let x = 0; x <= canvasWidth; x += spacing) {
    const isMajor = x % majorSpacing === 0;
    const lineOptions = {
      stroke: isMajor ? majorColor : color,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      opacity: isMajor ? majorOpacity : opacity,
      selectable: false,
      evented: false,
      gridObject: true,
      gridType: isMajor ? 'verticalMajor' : 'vertical',
      visible: visible
    };

    const line = new window.fabric.Line([x, 0, x, canvasHeight], lineOptions) as GridLine;
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }

  // Create horizontal lines
  for (let y = 0; y <= canvasHeight; y += spacing) {
    const isMajor = y % majorSpacing === 0;
    const lineOptions = {
      stroke: isMajor ? majorColor : color,
      strokeWidth: isMajor ? majorStrokeWidth : strokeWidth,
      opacity: isMajor ? majorOpacity : opacity,
      selectable: false,
      evented: false,
      gridObject: true,
      gridType: isMajor ? 'horizontalMajor' : 'horizontal',
      visible: visible
    };

    const line = new window.fabric.Line([0, y, canvasWidth, y], lineOptions) as GridLine;
    canvas.add(line);
    canvas.sendToBack(line);
    gridObjects.push(line);
  }

  canvas.requestRenderAll();
  return gridObjects;
}

/**
 * Creates a simple grid
 */
export function createSimpleGrid(
  canvas: FabricCanvas,
  gridSize: number = 50,
  color: string = '#e0e0e0'
): GridLine[] {
  return createGrid(canvas, { spacing: gridSize, color });
}

/**
 * Check if an object is part of the grid
 */
export function isGridObject(obj: FabricObject): boolean {
  return !!(obj as any).gridObject;
}

export function createCompleteGrid(canvas: FabricCanvas): FabricObject[] {
  return createGrid(canvas);
}

export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  return createGrid(canvas, { spacing: 100, color: '#ff0000', opacity: 0.3 });
}
