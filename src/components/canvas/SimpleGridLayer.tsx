
import React, { useEffect, useState } from 'react';
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface SimpleGridLayerProps {
  canvas: Canvas;
  gridSize?: number;
  visible?: boolean;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({
  canvas,
  gridSize = 20,
  visible = true
}) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  
  // Create grid on component mount
  useEffect(() => {
    if (!canvas) return;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: FabricObject[] = [];
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % (gridSize * 5) === 0;
      const line = new Line([x, 0, x, height], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % (gridSize * 5) === 0;
      const line = new Line([0, y, width, y], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Send grid to back
    objects.forEach(obj => canvas.sendToBack(obj));
    
    setGridObjects(objects);
    canvas.requestRenderAll();
    
    // Clean up on unmount
    return () => {
      objects.forEach(obj => {
        canvas.remove(obj);
      });
      canvas.requestRenderAll();
    };
  }, [canvas, gridSize]);
  
  // Update visibility when prop changes
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      obj.set({ visible });
    });
    
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);
  
  return null;
};
