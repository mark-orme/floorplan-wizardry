
import React, { useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';
import { 
  SMALL_GRID_SIZE,
  LARGE_GRID_SIZE, 
  SMALL_GRID_COLOR,
  LARGE_GRID_COLOR,
  GRID_CONSTANTS
} from '@/constants/gridConstants';

interface GridRendererProps {
  canvas: FabricCanvas;
  gridSize?: number;
  visible?: boolean;
}

const GridRenderer: React.FC<GridRendererProps> = ({
  canvas,
  gridSize = SMALL_GRID_SIZE,
  visible = true
}) => {
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: ExtendedFabricObject[] = [];

    // Create vertical grid lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % LARGE_GRID_SIZE === 0;
      const line = createFabricLine([x, 0, x, height], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        visible,
        isGrid: true,
        isLargeGrid: isLargeLine
      }) as ExtendedFabricObject;
      
      canvas.add(line);
      objects.push(line);
    }

    // Create horizontal grid lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % LARGE_GRID_SIZE === 0;
      const line = createFabricLine([0, y, width, y], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        visible,
        isGrid: true,
        isLargeGrid: isLargeLine
      }) as ExtendedFabricObject;
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Send grid to back
    objects.forEach(obj => {
      canvas.sendToBack(obj);
    });

    setGridObjects(objects);
    canvas.requestRenderAll();

    // Clean up on unmount
    return () => {
      objects.forEach(obj => {
        canvas.remove(obj);
      });
      canvas.requestRenderAll();
    };
  }, [canvas, gridSize, visible]);

  // Update visibility when it changes
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;

    gridObjects.forEach(obj => {
      if (obj && typeof obj.set === 'function') {
        obj.set('visible', visible);
      }
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridObjects, visible]);

  return null;
};

export default GridRenderer;
