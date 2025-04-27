
import { Canvas, Object as FabricObject } from 'fabric';

export const createSimpleGrid = (
  canvas: Canvas, 
  gridSize: number = 20, 
  color: string = '#e0e0e0'
): FabricObject[] => {
  if (!canvas) return [];
  
  const gridObjects: FabricObject[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const isLargeLine = x % (gridSize * 5) === 0;
    const line = new fabric.Line([x, 0, x, height], {
      stroke: isLargeLine ? '#c0c0c0' : color,
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    const isLargeLine = y % (gridSize * 5) === 0;
    const line = new fabric.Line([0, y, width, y], {
      stroke: isLargeLine ? '#c0c0c0' : color,
      strokeWidth: isLargeLine ? 1 : 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid'
    });
    
    canvas.add(line);
    gridObjects.push(line);
  }
  
  // Send grid to back
  gridObjects.forEach(obj => {
    canvas.sendToBack(obj);
  });
  
  return gridObjects;
};

export const ensureGridVisible = (canvas: Canvas, gridObjects: FabricObject[]) => {
  if (!canvas || gridObjects.length === 0) return;
  
  let needsRender = false;
  
  gridObjects.forEach(obj => {
    if (obj && !obj.visible) {
      if (typeof obj.set === 'function') {
        obj.set('visible', true);
        needsRender = true;
      }
    }
  });
  
  if (needsRender) {
    canvas.requestRenderAll();
  }
};
