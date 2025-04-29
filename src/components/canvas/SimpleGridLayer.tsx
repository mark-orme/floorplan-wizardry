
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import type { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import type { ExtendedFabricCanvas } from '@/types/ExtendedFabricCanvas';
import { asExtendedCanvas, asExtendedObject } from '@/utils/canvas/canvasTypeUtils';

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
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!canvas || initialized.current) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const extendedCanvas = asExtendedCanvas(canvas);
    if (!extendedCanvas) return;
    
    const newObjects: fabric.Object[] = [];

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
      (obj as any).visible = visible;
      
      // Fixed: Check if set method exists before calling it
      if (typeof obj.set === 'function') {
        obj.set({ visible });
      }
    });

    canvas.renderAll();
  }, [canvas, gridObjects, visible]);

  return null;
};
