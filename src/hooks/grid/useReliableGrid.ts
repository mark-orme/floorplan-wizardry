
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject, Line } from 'fabric';
import { toast } from 'sonner';
import logger from '@/utils/logger';

interface UseReliableGridProps {
  canvas: FabricCanvas | null;
  gridSpacing?: number;
  enabled?: boolean;
}

export const useReliableGrid = ({ 
  canvas, 
  gridSpacing = 20, 
  enabled = true 
}: UseReliableGridProps) => {
  const [isGridCreated, setIsGridCreated] = useState(false);
  const gridObjectsRef = useRef<FabricObject[]>([]);
  const retryAttemptsRef = useRef(0);
  const MAX_RETRIES = 3;

  const createGrid = useCallback(() => {
    if (!canvas || !enabled) return [];
    
    try {
      // Clear existing grid
      gridObjectsRef.current.forEach(obj => canvas.remove(obj));
      gridObjectsRef.current = [];

      const width = canvas.getWidth();
      const height = canvas.getHeight();

      // Create vertical lines
      for (let i = 0; i <= width; i += gridSpacing) {
        const line = new Line([i, 0, i, height], {
          stroke: '#e5e5e5',
          selectable: false,
          evented: false,
          objectCaching: false,
          strokeWidth: i % (gridSpacing * 5) === 0 ? 1 : 0.5
        });
        canvas.add(line);
        gridObjectsRef.current.push(line);
      }

      // Create horizontal lines
      for (let i = 0; i <= height; i += gridSpacing) {
        const line = new Line([0, i, width, i], {
          stroke: '#e5e5e5',
          selectable: false,
          evented: false,
          objectCaching: false,
          strokeWidth: i % (gridSpacing * 5) === 0 ? 1 : 0.5
        });
        canvas.add(line);
        gridObjectsRef.current.push(line);
      }

      canvas.requestRenderAll();
      setIsGridCreated(true);
      retryAttemptsRef.current = 0;
      
      return gridObjectsRef.current;
    } catch (error) {
      logger.error('Error creating grid:', error);
      
      if (retryAttemptsRef.current < MAX_RETRIES) {
        retryAttemptsRef.current++;
        setTimeout(createGrid, 500);
      } else {
        toast.error('Failed to create grid after multiple attempts');
      }
      
      return [];
    }
  }, [canvas, enabled, gridSpacing]);

  const reinitializeGrid = useCallback(() => {
    retryAttemptsRef.current = 0;
    setIsGridCreated(false);
    return createGrid();
  }, [createGrid]);

  // Initialize grid when canvas is ready
  useEffect(() => {
    if (canvas && enabled && !isGridCreated) {
      createGrid();
    }
  }, [canvas, enabled, isGridCreated, createGrid]);

  return {
    isGridCreated,
    gridObjects: gridObjectsRef.current,
    reinitializeGrid
  };
};

