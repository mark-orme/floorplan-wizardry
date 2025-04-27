
import React, { useEffect, useState } from 'react';
import { Canvas } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';

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
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);

  useEffect(() => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newObjects: ExtendedFabricObject[] = [];

    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = createFabricLine([x, 0, x, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        visible
      }) as ExtendedFabricObject;
      
      canvas.add(line);
      newObjects.push(line);
    }

    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = createFabricLine([0, y, width, y], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        visible
      }) as ExtendedFabricObject;
      
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
      obj.set({ visible });
    });
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};
