
import React, { useEffect, useState } from 'react';
import { Canvas, Line as FabricLine } from 'fabric';
import type { Object as FabricObject } from 'fabric';

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

  useEffect(() => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newObjects: FabricObject[] = [];

    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new FabricLine([x, 0, x, height], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        visible
      });
      canvas.add(line);
      newObjects.push(line);
    }

    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new FabricLine([0, y, width, y], {
        stroke: '#e0e0e0',
        strokeWidth: 0.5,
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
      obj.set('visible', visible);
    });
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};
