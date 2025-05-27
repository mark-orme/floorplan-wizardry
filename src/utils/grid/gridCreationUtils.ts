
import { Canvas as FabricCanvas, Line } from 'fabric';

export const createBasicEmergencyGrid = (canvas: FabricCanvas, gridSize: number = 20) => {
  const objects: any[] = [];
  const width = canvas.getWidth();
  const height = canvas.getHeight();
  
  // Create vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    const line = new Line([x, 0, x, height], {
      stroke: '#e0e0e0',
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
      stroke: '#e0e0e0',
      strokeWidth: 0.5,
      selectable: false,
      evented: false
    });
    canvas.add(line);
    objects.push(line);
  }
  
  return objects;
};
