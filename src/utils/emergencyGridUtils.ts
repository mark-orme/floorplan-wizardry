
/**
 * Emergency grid utility functions
 * Provides backup grid functionality when main grid fails
 * @module emergencyGridUtils
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { GRID_SPACING } from '@/constants/numerics';

/**
 * Creates a basic grid on the canvas
 * Used as emergency backup when primary grid fails
 * 
 * @param canvas - Fabric canvas
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Array of grid lines
 */
export const createEmergencyGrid = (canvas: FabricCanvas, width: number, height: number) => {
  const gridLines = [];

  // Create vertical small grid lines
  for (let x = 0; x <= width; x += GRID_SPACING.SMALL) {
    const line = new Line([x, 0, x, height], {
      stroke: '#eeeeee',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
    // FIX: Use sendObjectToBack instead of sendToBack
    canvas.sendObjectToBack(line);
  }

  // Create horizontal small grid lines
  for (let y = 0; y <= height; y += GRID_SPACING.SMALL) {
    const line = new Line([0, y, width, y], {
      stroke: '#eeeeee',
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
    // FIX: Use sendObjectToBack instead of sendToBack
    canvas.sendObjectToBack(line);
  }

  // Create vertical large grid lines
  for (let x = 0; x <= width; x += GRID_SPACING.LARGE) {
    const line = new Line([x, 0, x, height], {
      stroke: '#dddddd',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
    // FIX: Use sendObjectToBack instead of sendToBack
    canvas.sendObjectToBack(line);
  }

  // Create horizontal large grid lines
  for (let y = 0; y <= height; y += GRID_SPACING.LARGE) {
    const line = new Line([0, y, width, y], {
      stroke: '#dddddd',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      objectType: 'grid',
      hoverCursor: 'default'
    });
    
    gridLines.push(line);
    canvas.add(line);
    // FIX: Use sendObjectToBack instead of sendToBack
    canvas.sendObjectToBack(line);
  }

  canvas.renderAll();
  return gridLines;
};

/**
 * Remove all grid lines from the canvas
 * @param canvas - Fabric canvas
 */
export const removeEmergencyGrid = (canvas: FabricCanvas) => {
  if (!canvas) return;

  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );

  gridObjects.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
};

/**
 * Toggle grid visibility
 * @param canvas - Fabric canvas
 * @param visible - Whether grid should be visible
 */
export const toggleEmergencyGridVisibility = (canvas: FabricCanvas, visible: boolean) => {
  if (!canvas) return;

  const gridObjects = canvas.getObjects().filter(obj => 
    (obj as any).objectType === 'grid'
  );

  gridObjects.forEach(obj => {
    obj.set('visible', visible);
  });

  canvas.renderAll();
};
