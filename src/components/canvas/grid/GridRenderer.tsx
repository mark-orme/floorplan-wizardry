
import { useEffect, useRef, useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface GridRendererProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  onRender?: (objects: FabricObject[]) => void;
}

const GridRenderer = ({
  canvas,
  gridSize = 20,
  visible = true,
  onRender
}: GridRendererProps) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const createdRef = useRef(false);
  
  // Create grid when canvas is ready
  useEffect(() => {
    if (!canvas || createdRef.current) return;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const objects: FabricObject[] = [];
    
    // Create vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      const isLargeLine = x % (gridSize * 5) === 0;
      const line = new fabric.Line([x, 0, x, canvasHeight], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        visible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      const isLargeLine = y % (gridSize * 5) === 0;
      const line = new fabric.Line([0, y, canvasWidth, y], {
        stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
        strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
        selectable: false,
        evented: false,
        objectType: 'grid',
        visible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Send grid to back
    objects.forEach(obj => canvas.sendToBack(obj));
    
    setGridObjects(objects);
    createdRef.current = true;
    
    if (onRender) {
      onRender(objects);
    }
    
    canvas.requestRenderAll();
  }, [canvas, gridSize, visible, onRender]);
  
  // Update grid visibility
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
