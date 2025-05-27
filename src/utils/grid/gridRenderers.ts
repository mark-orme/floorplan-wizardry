
import { Canvas as FabricCanvas, Line } from 'fabric';

export const createGrid = (canvas: FabricCanvas, gridSize: number = 20, color: string = '#e0e0e0') => {
  const objects: any[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: color,
      strokeWidth: 0.5,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    objects.push(line);
  }
  
  // Create horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    const line = new Line([0, y, width, y], {
      stroke: color,
      strokeWidth: 0.5,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    objects.push(line);
  }
  
  return objects;
};
