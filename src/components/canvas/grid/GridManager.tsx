
import { useEffect, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';

interface GridManagerProps {
  canvas: FabricCanvas | null;
  spacing?: number;
  visible?: boolean;
  onChange?: (grid: FabricObject[]) => void;
}

const GridManager = ({
  canvas,
  spacing = 20,
  visible = true,
  onChange
}: GridManagerProps) => {
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: ExtendedFabricObject[] = [];

    try {
      // Create grid lines
      for (let x = 0; x <= width; x += spacing) {
        const isLargeLine = x % (spacing * 5) === 0;
        const line = createFabricLine([x, 0, x, height], {
          stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false
        }) as ExtendedFabricObject;
        
        canvas.add(line);
        objects.push(line);
      }

      for (let y = 0; y <= height; y += spacing) {
        const isLargeLine = y % (spacing * 5) === 0;
        const line = createFabricLine([0, y, width, y], {
          stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false
        }) as ExtendedFabricObject;
        
        canvas.add(line);
        objects.push(line);
      }

      setGridObjects(objects);
      if (onChange) onChange(objects);
      canvas.requestRenderAll();

    } catch (error) {
      console.error('Error creating grid:', error);
    }

    return () => {
      objects.forEach(obj => canvas.remove(obj));
      canvas.requestRenderAll();
    };
  }, [canvas, spacing, onChange]);

  // Update visibility
  useEffect(() => {
    if (!canvas) return;
    
    gridObjects.forEach(obj => {
      if (obj && typeof obj.set === 'function') {
        obj.set({ visible });
      }
    });
    
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};

export default GridManager;
