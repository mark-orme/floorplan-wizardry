
import { useEffect, useRef, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { createGrid } from '@/utils/canvas/reliableGridRenderer';

interface UseReliableGridProps {
  canvas: FabricCanvas | null;
  gridSpacing?: number;
  majorGridInterval?: number;
  gridColor?: string;
  majorGridColor?: string;
  gridSize?: number;
  enabled?: boolean;
}

export const useReliableGrid = ({
  canvas,
  gridSpacing = 20,
  majorGridInterval = 5,
  gridColor = '#e5e5e5',
  majorGridColor = '#c0c0c0',
  gridSize = 5000,
  enabled = true
}: UseReliableGridProps) => {
  // Store reference to grid objects
  const gridObjectsRef = useRef<any[]>([]);
  const isGridCreatedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  
  // Create grid
  const initializeGrid = useCallback(() => {
    if (!canvas || !enabled) return;
    
    try {
      console.log('Initializing grid...');
      
      const gridObjects = createGrid(canvas, {
        gridSpacing,
        majorGridInterval,
        gridColor,
        majorGridColor,
        gridSize
      });
      
      gridObjectsRef.current = gridObjects;
      isGridCreatedRef.current = gridObjects.length > 0;
      
      console.log(`Grid initialized with ${gridObjects.length} objects`);
    } catch (error) {
      console.error('Error initializing grid:', error);
      isGridCreatedRef.current = false;
    }
  }, [canvas, enabled, gridSpacing, majorGridInterval, gridColor, majorGridColor, gridSize]);
  
  // Initialize grid on mount and when canvas changes
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const initGrid = () => {
      if (!canvas || isGridCreatedRef.current) return;
      
      if (retryCountRef.current < maxRetries) {
        try {
          initializeGrid();
          
          if (gridObjectsRef.current.length === 0) {
            // If grid objects array is empty, retry after a delay
            retryCountRef.current += 1;
            setTimeout(initGrid, 500);
          }
        } catch (error) {
          console.error('Error in grid initialization:', error);
          retryCountRef.current += 1;
          setTimeout(initGrid, 500);
        }
      } else {
        console.error(`Failed to create grid after ${maxRetries} attempts`);
      }
    };
    
    initGrid();
    
    return () => {
      // Clean up grid objects when component unmounts
      if (canvas && gridObjectsRef.current.length > 0) {
        gridObjectsRef.current.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
        canvas.requestRenderAll();
        gridObjectsRef.current = [];
        isGridCreatedRef.current = false;
      }
    };
  }, [canvas, enabled, initializeGrid, maxRetries]);
  
  // Update grid on resize
  useEffect(() => {
    if (!canvas || !enabled) return;
    
    const handleResize = () => {
      initializeGrid();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [canvas, enabled, initializeGrid]);
  
  // Reinitialize grid method exposed to consumer
  const reinitializeGrid = useCallback(() => {
    if (!canvas) return;
    
    // Clear existing grid
    if (gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
    }
    
    // Reset state
    gridObjectsRef.current = [];
    isGridCreatedRef.current = false;
    retryCountRef.current = 0;
    
    // Create new grid
    initializeGrid();
  }, [canvas, initializeGrid]);
  
  return {
    isGridCreated: isGridCreatedRef.current,
    gridObjects: gridObjectsRef.current,
    reinitializeGrid
  };
};
