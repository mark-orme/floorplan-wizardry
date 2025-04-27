
import { useEffect, useState } from 'react';
import { Canvas, Object as FabricObject, Line } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

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
  
  // Create grid when canvas is ready
  useEffect(() => {
    if (!canvas) return;
    
    // Remove any existing grid
    gridObjects.forEach(obj => canvas.remove(obj));
    
    if (!visible) {
      setGridObjects([]);
      if (onChange) onChange([]);
      return;
    }
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: FabricObject[] = [];
    
    // Create horizontal and vertical grid lines
    for (let x = 0; x <= width; x += spacing) {
      const isLargeLine = x % (spacing * 5) === 0;
      const line = new Line([x, 0, x, height], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    for (let y = 0; y <= height; y += spacing) {
      const isLargeLine = y % (spacing * 5) === 0;
      const line = new Line([0, y, width, y], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Send grid to back
    objects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    setGridObjects(objects);
    if (onChange) onChange(objects);
    
    canvas.requestRenderAll();
  }, [canvas, spacing, visible, onChange]);
  
  // Update grid visibility
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      obj.set({ visible });
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridObjects, visible]);
  
  return null;
};

export default GridManager;
