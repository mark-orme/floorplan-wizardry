
import React, { useEffect, useRef, useState, memo } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { GRID_CONSTANTS, SMALL_GRID_SIZE, LARGE_GRID_SIZE, SMALL_GRID_COLOR, LARGE_GRID_COLOR } from '@/constants/gridConstants';

interface MemoizedGridProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  onCreated?: (gridObjects: FabricObject[]) => void;
}

const MemoizedGridComponent = ({ 
  canvas, 
  gridSize = SMALL_GRID_SIZE, 
  visible = true, 
  onCreated 
}: MemoizedGridProps) => {
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const isCreatedRef = useRef(false);
  
  // Create grid when canvas is ready
  useEffect(() => {
    if (!canvas || isCreatedRef.current) return;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newGridObjects: FabricObject[] = [];
    
    try {
      // Create vertical grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const isLargeLine = x % LARGE_GRID_SIZE === 0;
        const line = new fabric.Line([x, 0, x, height], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible,
          isGrid: true,
          isLargeGrid: isLargeLine
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create horizontal grid lines
      for (let y = 0; y <= height; y += gridSize) {
        const isLargeLine = y % LARGE_GRID_SIZE === 0;
        const line = new fabric.Line([0, y, width, y], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          objectType: 'grid',
          visible,
          isGrid: true,
          isLargeGrid: isLargeLine
        });
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Send grid to back
      newGridObjects.forEach(obj => {
        canvas.sendToBack(obj);
      });
      
      setGridObjects(newGridObjects);
      isCreatedRef.current = true;
      
      if (onCreated) {
        onCreated(newGridObjects);
      }
      
      canvas.requestRenderAll();
    } catch (error) {
      console.error('Error creating grid:', error);
    }
  }, [canvas, gridSize, visible, onCreated]);
  
  // Update grid visibility when visible prop changes
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

export const MemoizedGrid = memo(MemoizedGridComponent);
