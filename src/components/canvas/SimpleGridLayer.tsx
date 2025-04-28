
import React, { useEffect, useState } from 'react';
import { SMALL_GRID_COLOR, LARGE_GRID_COLOR, SMALL_GRID_WIDTH, LARGE_GRID_WIDTH } from '@/constants/gridConstants';
import { ExtendedFabricCanvas, ExtendedFabricObject } from '@/types/canvas-types';

interface SimpleGridLayerProps {
  canvas: ExtendedFabricCanvas;
  gridSize?: number;
  visible?: boolean;
  largeGridInterval?: number;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({
  canvas,
  gridSize = 20,
  visible = true,
  largeGridInterval = 100
}) => {
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);

  useEffect(() => {
    if (!canvas) return;

    // Remove any existing grid
    gridObjects.forEach(obj => {
      canvas.remove(obj);
    });

    const newGridObjects: ExtendedFabricObject[] = [];
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % largeGridInterval === 0;
      const line = new window.fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        visible
      }) as ExtendedFabricObject;
      
      canvas.add(line);
      newGridObjects.push(line);
    }

    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % largeGridInterval === 0;
      const line = new window.fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
        strokeWidth: isLargeLine ? LARGE_GRID_WIDTH : SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        visible
      }) as ExtendedFabricObject;
      
      canvas.add(line);
      newGridObjects.push(line);
    }

    // Send all grid objects to back
    newGridObjects.forEach(obj => {
      canvas.sendToBack(obj);
    });

    setGridObjects(newGridObjects);

    return () => {
      if (canvas) {
        newGridObjects.forEach(obj => {
          canvas.remove(obj);
        });
      }
    };
  }, [canvas, gridSize, largeGridInterval]);

  // Update visibility when it changes
  useEffect(() => {
    if (!canvas) return;

    gridObjects.forEach(obj => {
      if (obj) {
        obj.set({ visible });
      }
    });

    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};
