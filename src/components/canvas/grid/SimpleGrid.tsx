
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { SMALL_GRID_SIZE } from '@/constants/gridConstants';

interface SimpleGridProps {
  canvas: fabric.Canvas;
  gridSize?: number;
  showControls?: boolean;
  defaultVisible?: boolean;
  onGridCreated?: (objects: fabric.Object[]) => void;
}

export const SimpleGrid: React.FC<SimpleGridProps> = ({
  canvas,
  gridSize = SMALL_GRID_SIZE,
  showControls = false,
  defaultVisible = true,
  onGridCreated
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);
  const isInitializedRef = useRef(false);
  
  // Create grid on mount
  useEffect(() => {
    if (!canvas || isInitializedRef.current) return;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const objects: fabric.Object[] = [];
    
    // Create vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const isLargeLine = x % (gridSize * 5) === 0;
      const line = new fabric.Line([x, 0, x, height], {
        stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
        strokeWidth: isLargeLine ? 1.0 : 0.5,
        selectable: false,
        evented: false,
        visible: isVisible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Create horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const isLargeLine = y % (gridSize * 5) === 0;
      const line = new fabric.Line([0, y, width, y], {
        stroke: isLargeLine ? '#c0c0c0' : '#e0e0e0',
        strokeWidth: isLargeLine ? 1.0 : 0.5,
        selectable: false,
        evented: false,
        visible: isVisible
      });
      
      canvas.add(line);
      objects.push(line);
    }
    
    // Send grid to back
    objects.forEach(obj => {
      canvas.sendToBack(obj);
    });
    
    setGridObjects(objects);
    isInitializedRef.current = true;
    
    if (onGridCreated) {
      onGridCreated(objects);
    }
  }, [canvas, gridSize, isVisible, onGridCreated]);
  
  // Toggle grid visibility
  const toggleGrid = () => {
    setIsVisible(!isVisible);
    
    gridObjects.forEach(obj => {
      if (obj) {
        obj.set({ visible: !isVisible });
      }
    });
    
    canvas.requestRenderAll();
  };
  
  // Update grid visibility when isVisible changes
  useEffect(() => {
    if (gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      if (obj) {
        obj.set({ visible: isVisible });
      }
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridObjects, isVisible]);
  
  return showControls ? (
    <div className="grid-controls">
      <button onClick={toggleGrid}>
        {isVisible ? 'Hide Grid' : 'Show Grid'}
      </button>
    </div>
  ) : null;
};
