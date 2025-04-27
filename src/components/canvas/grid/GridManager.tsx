
import { useEffect, useState } from 'react';
import { Canvas, Line as FabricLine } from 'fabric';
import type { Object as FabricObject } from 'fabric';

interface GridManagerProps {
  canvas: Canvas | null;
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
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);

  useEffect(() => {
    if (!canvas) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: FabricObject[] = [];

    try {
      // Create grid lines
      for (let x = 0; x <= width; x += spacing) {
        const isLargeLine = x % (spacing * 5) === 0;
        const line = new FabricLine([x, 0, x, height], {
          stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false
        });
        
        canvas.add(line);
        objects.push(line);
      }

      for (let y = 0; y <= height; y += spacing) {
        const isLargeLine = y % (spacing * 5) === 0;
        const line = new FabricLine([0, y, width, y], {
          stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
          strokeWidth: isLargeLine ? 1 : 0.5,
          selectable: false,
          evented: false
        });
        
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
      obj.set('visible', visible);
    });
    
    canvas.requestRenderAll();
  }, [canvas, visible, gridObjects]);

  return null;
};

export default GridManager;
