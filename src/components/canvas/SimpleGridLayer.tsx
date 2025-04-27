
import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { SMALL_GRID_COLOR, SMALL_GRID_WIDTH } from '@/constants/gridConstants';

interface SimpleGridLayerProps {
  canvas: fabric.Canvas;
  gridSize?: number;
  visible?: boolean;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({
  canvas,
  gridSize = 20,
  visible = true
}) => {
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);

  useEffect(() => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newObjects: fabric.Object[] = [];

    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(line);
      newObjects.push(line);
    }

    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], {
        stroke: SMALL_GRID_COLOR,
        strokeWidth: SMALL_GRID_WIDTH,
        selectable: false,
        evented: false,
        visible
      });
      
      canvas.add(line);
      newObjects.push(line);
    }

    setGridObjects(newObjects);
    canvas.requestRenderAll();

    return () => {
      newObjects.forEach(obj => {
        canvas.remove(obj);
      });
    };
  }, [canvas, gridSize, visible]);

  useEffect(() => {
    gridObjects.forEach(obj => {
      if (obj) {
        obj.set({ visible });
      }
    });
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};
