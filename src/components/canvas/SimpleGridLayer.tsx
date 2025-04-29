
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Canvas as FabricCanvas } from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/canvas-types';

interface SimpleGridLayerProps {
  canvas: FabricCanvas | ExtendedFabricCanvas | null;
  gridSize?: number;
  largeGridSize?: number;
  gridColor?: string;
  largeGridColor?: string;
  visible?: boolean;
}

export const SimpleGridLayer: React.FC<SimpleGridLayerProps> = ({
  canvas,
  gridSize = 10,
  largeGridSize = 50,
  gridColor = '#e0e0e0',
  largeGridColor = '#c0c0c0',
  visible = true
}) => {
  const [gridObjects, setGridObjects] = useState<any[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!canvas || initialized.current) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    
    const newObjects: any[] = [];

    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLarge = y % largeGridSize === 0;
      const lineProps = {
        stroke: isLarge ? largeGridColor : gridColor,
        strokeWidth: isLarge ? 0.5 : 0.2,
        selectable: false,
        evented: false,
      };

      const line = new fabric.Line([0, y, width, y], lineProps);
      // Direct add to canvas without type assertions
      canvas.add(line);
      newObjects.push(line);
    }

    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLarge = x % largeGridSize === 0;
      const lineProps = {
        stroke: isLarge ? largeGridColor : gridColor,
        strokeWidth: isLarge ? 0.5 : 0.2,
        selectable: false,
        evented: false,
      };

      const line = new fabric.Line([x, 0, x, height], lineProps);
      // Direct add to canvas without type assertions
      canvas.add(line);
      newObjects.push(line);
    }

    // Send all grid objects to the back
    newObjects.forEach(obj => {
      if (canvas.sendToBack) {
        canvas.sendToBack(obj);
      }
    });

    setGridObjects(newObjects);
    initialized.current = true;
    canvas.renderAll();

    return () => {
      if (canvas) {
        newObjects.forEach(obj => {
          canvas.remove(obj);
        });
        canvas.renderAll();
      }
    };
  }, [canvas, gridSize, largeGridSize, gridColor, largeGridColor]);

  useEffect(() => {
    if (!canvas || !gridObjects.length) return;

    gridObjects.forEach(obj => {
      // Make sure visible property is set directly
      obj.visible = visible;
    });

    canvas.renderAll();
  }, [canvas, gridObjects, visible]);

  return null;
};
