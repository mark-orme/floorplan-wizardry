
import React, { useEffect, useRef, useState, memo } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { createFabricLine } from '@/types/fabric-extended';
import type { ExtendedFabricObject } from '@/types/fabric-extended';
import { GRID_CONSTANTS, SMALL_GRID_SIZE, LARGE_GRID_SIZE, SMALL_GRID_COLOR, LARGE_GRID_COLOR } from '@/constants/gridConstants';

interface MemoizedGridProps {
  canvas: Canvas | null;
  gridSize?: number;
  visible?: boolean;
  onCreated?: (gridObjects: ExtendedFabricObject[]) => void;
}

const MemoizedGridComponent = ({ 
  canvas, 
  gridSize = SMALL_GRID_SIZE, 
  visible = true, 
  onCreated 
}: MemoizedGridProps) => {
  const [gridObjects, setGridObjects] = useState<ExtendedFabricObject[]>([]);
  const isCreatedRef = useRef(false);
  
  // Create grid when canvas is ready
  useEffect(() => {
    if (!canvas || isCreatedRef.current) return;
    
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const newGridObjects: ExtendedFabricObject[] = [];
    
    try {
      // Create vertical grid lines
      for (let x = 0; x <= width; x += gridSize) {
        const isLargeLine = x % LARGE_GRID_SIZE === 0;
        const line = createFabricLine([x, 0, x, height], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          visible
        }) as ExtendedFabricObject;
        
        canvas.add(line);
        newGridObjects.push(line);
      }
      
      // Create horizontal grid lines
      for (let y = 0; y <= height; y += gridSize) {
        const isLargeLine = y % LARGE_GRID_SIZE === 0;
        const line = createFabricLine([0, y, width, y], {
          stroke: isLargeLine ? LARGE_GRID_COLOR : SMALL_GRID_COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          visible
        }) as ExtendedFabricObject;
        
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
      obj.set({ visible });
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridObjects, visible]);
  
  return null;
};

export const MemoizedGrid = memo(MemoizedGridComponent);
