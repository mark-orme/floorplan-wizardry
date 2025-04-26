
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Create a basic emergency grid
 * This is a simplified grid used when the normal grid creation fails
 * @param canvas Canvas to create grid on
 * @returns Array of created grid objects
 */
export function createBasicEmergencyGrid(canvas: FabricCanvas): FabricObject[] {
  if (!canvas) {
    console.error('Cannot create emergency grid: Canvas is null');
    return [];
  }

  const width = canvas.getWidth();
  const height = canvas.getHeight();
  const spacing = 50;
  const gridObjects: FabricObject[] = [];

  try {
    // Create horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      const line = new window.fabric.Line([0, y, width, y], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        opacity: 0.5,
        selectable: false,
        evented: false,
        visible: true
      });
      
      line.set('objectType', 'grid');
      canvas.add(line);
      gridObjects.push(line);
    }
    
    // Create vertical lines
    for (let x = 0; x <= width; x += spacing) {
      const line = new window.fabric.Line([x, 0, x, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        opacity: 0.5,
        selectable: false,
        evented: false,
        visible: true
      });
      
      line.set('objectType', 'grid');
      canvas.add(line);
      gridObjects.push(line);
    }
    
    canvas.renderAll();
  } catch (error) {
    console.error('Error creating emergency grid:', error);
  }
  
  return gridObjects;
}
