
import { useState, useEffect, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGrid } from '@/utils/canvas/reliableGridRenderer';
import { measurePerformance } from '@/utils/performance';

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
  const [gridObjects, setGridObjects] = useState<FabricObject[]>([]);
  const creationAttempts = useRef(0);
  
  // Create grid with performance monitoring
  const createReliableGrid = useCallback(() => {
    if (!canvas || !enabled) return;
    
    creationAttempts.current += 1;
    
    // Using the performance measurement utility
    const [newGridObjects, measurement] = measurePerformance('grid.creation', () => {
      return createGrid(canvas, {
        gridSpacing,
        majorGridInterval: 5,
        gridColor: '#e5e5e5',
        majorGridColor: '#c0c0c0',
        gridSize: 5000
      });
    });
    
    if (newGridObjects.length > 0) {
      console.log(`Grid created with ${newGridObjects.length} objects in ${measurement.duration.toFixed(2)}ms`);
      setGridObjects(newGridObjects);
      setIsGridCreated(true);
    } else {
      console.warn(`Grid creation failed on attempt ${creationAttempts.current}`);
      setIsGridCreated(false);
    }
  }, [canvas, enabled, gridSpacing]);
  
  // Initialize grid on canvas change or enable state change
  useEffect(() => {
    if (canvas && enabled && !isGridCreated) {
      // Small delay to ensure canvas is fully initialized
      const timer = setTimeout(() => {
        createReliableGrid();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [canvas, enabled, isGridCreated, createReliableGrid]);
  
  // Reinitialize grid (can be called externally)
  const reinitializeGrid = useCallback(() => {
    // Clear existing grid
    if (canvas) {
      gridObjects.forEach(obj => {
        if (canvas.contains(obj)) {
          canvas.remove(obj);
        }
      });
      setGridObjects([]);
      setIsGridCreated(false);
      creationAttempts.current = 0;
      
      // Create new grid
      createReliableGrid();
    }
  }, [canvas, gridObjects, createReliableGrid]);
  
  // Clean up grid on unmount
  useEffect(() => {
    return () => {
      if (canvas) {
        gridObjects.forEach(obj => {
          if (canvas.contains(obj)) {
            canvas.remove(obj);
          }
        });
      }
    };
  }, [canvas, gridObjects]);
  
  return {
    isGridCreated,
    gridObjects,
    reinitializeGrid
  };
};
