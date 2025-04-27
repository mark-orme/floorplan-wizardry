
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import logger from '@/utils/logger';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

interface OptimizedGridLayerProps {
  canvas: fabric.Canvas | null;
  gridSize?: number;
  visible?: boolean;
  onGridCreated?: (objects: fabric.Object[]) => void;
}

export const OptimizedGridLayer: React.FC<OptimizedGridLayerProps> = ({
  canvas,
  gridSize = 20,
  visible = true,
  onGridCreated
}) => {
  const [gridObjects, setGridObjects] = useState<fabric.Object[]>([]);
  const isInitializedRef = useRef(false);
  
  // Create grid when canvas is ready
  useEffect(() => {
    if (!canvas || isInitializedRef.current) return;
    
    try {
      logger.info('Creating optimized grid layer');
      
      const width = canvas.getWidth();
      const height = canvas.getHeight();
      const objects: fabric.Object[] = [];
      
      // Create vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        const isLargeLine = x % (gridSize * 5) === 0;
        const line = new fabric.Line([x, 0, x, height], {
          stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          visible
        });
        
        canvas.add(line);
        objects.push(line);
      }
      
      // Create horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        const isLargeLine = y % (gridSize * 5) === 0;
        const line = new fabric.Line([0, y, width, y], {
          stroke: isLargeLine ? GRID_CONSTANTS.LARGE.COLOR : GRID_CONSTANTS.SMALL.COLOR,
          strokeWidth: isLargeLine ? GRID_CONSTANTS.LARGE.WIDTH : GRID_CONSTANTS.SMALL.WIDTH,
          selectable: false,
          evented: false,
          visible
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
      
      logger.info(`Created optimized grid with ${objects.length} lines`);
      canvas.requestRenderAll();
    } catch (error) {
      logger.error('Error creating optimized grid:', error);
    }
  }, [canvas, gridSize, visible, onGridCreated]);
  
  // Update grid visibility when visible prop changes
  useEffect(() => {
    if (!canvas || gridObjects.length === 0) return;
    
    gridObjects.forEach(obj => {
      if (obj) {
        obj.set({ visible });
      }
    });
    
    canvas.requestRenderAll();
  }, [canvas, gridObjects, visible]);
  
  return null;
};
